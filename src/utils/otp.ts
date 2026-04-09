type GenericRecord = Record<string, unknown>;

const toRecord = (value: unknown): GenericRecord => {
  if (value && typeof value === 'object') {
    return value as GenericRecord;
  }

  return {};
};

const toPositiveNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return undefined;
  }

  return Math.floor(parsed);
};

const toNonNegativeNumber = (value: unknown): number | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    return undefined;
  }

  return Math.floor(parsed);
};

const getPayloadSources = (payload: unknown): GenericRecord[] => {
  const source = toRecord(payload);
  const sourceData = toRecord(source?.data);
  const sourceMeta = toRecord(source?.meta);
  const sourceResult = toRecord(source?.result);

  return [source, sourceData, sourceMeta, sourceResult];
};

const getStringFromSources = (payload: unknown, keys: string[]) => {
  const sources = getPayloadSources(payload);

  for (const source of sources) {
    for (const key of keys) {
      const value = source?.[key];
      if (typeof value === 'string' && value.trim()) {
        return value.trim();
      }
    }
  }

  return '';
};

export const getMessageFromPayload = (payload: unknown, fallback = '') => {
  if (typeof payload === 'string' && payload.trim()) {
    return payload.trim();
  }

  const message = getStringFromSources(payload, [
    'message',
    'msg',
    'detail',
    'error',
    'error_message',
    'user_message',
  ]);

  return message || fallback;
};

export const getOtpAttemptsLeft = (payload: unknown) => {
  const sources = getPayloadSources(payload);
  const keys = [
    'attempts_left',
    'attemptsLeft',
    'remaining_attempts',
    'remainingAttempts',
    'otp_attempts_left',
    'otpAttemptsLeft',
  ];

  for (const source of sources) {
    for (const key of keys) {
      const value = toNonNegativeNumber(source?.[key]);
      if (value !== undefined) {
        return value;
      }
    }
  }

  return undefined;
};

export const getOtpExpirySeconds = (
  payload: unknown,
  fallbackSeconds = 60,
) => {
  const sources = getPayloadSources(payload);
  const expirySecondsKeys = [
    'expires_in',
    'expiresIn',
    'otp_expires_in',
    'otpExpiresIn',
    'retry_after_seconds',
    'retryAfterSeconds',
    'expiry_seconds',
    'expirySeconds',
    'otp_expiry_seconds',
    'otpExpirySeconds',
    'ttl',
  ];

  for (const source of sources) {
    for (const key of expirySecondsKeys) {
      const value = toPositiveNumber(source?.[key]);
      if (value !== undefined) {
        return value;
      }
    }
  }

  const expiryAt = getStringFromSources(payload, [
    'expires_at',
    'expiresAt',
    'otp_expires_at',
    'otpExpiresAt',
    'expiry_at',
    'expiryAt',
  ]);

  if (expiryAt) {
    const parsedExpiryAt = new Date(expiryAt);
    if (!Number.isNaN(parsedExpiryAt.getTime())) {
      const secondsLeft = Math.ceil((parsedExpiryAt.getTime() - Date.now()) / 1000);
      if (secondsLeft > 0) {
        return secondsLeft;
      }
    }
  }

  return fallbackSeconds;
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const errorRecord = toRecord(error);
  const response = toRecord(errorRecord?.response);
  const responseData = response?.data;

  const responseMessage = getMessageFromPayload(responseData, '');
  if (responseMessage) {
    return responseMessage;
  }

  const errorMessage = getMessageFromPayload(errorRecord, '');
  if (errorMessage) {
    return errorMessage;
  }

  if (typeof errorRecord?.message === 'string' && errorRecord.message.trim()) {
    return errorRecord.message.trim();
  }

  return fallback;
};

export const formatSecondsAsClock = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};
