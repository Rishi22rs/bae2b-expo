export type OnboardingStepId =
  | 'name'
  | 'birthday'
  | 'gender'
  | 'orientation'
  | 'passions';

type SelectionMode = 'single' | 'multiple';

interface OnboardingStepBase {
  id: OnboardingStepId;
  title: string;
  subtitle: string;
}

interface NameStepConfig extends OnboardingStepBase {
  id: 'name';
  fieldLabel: string;
  placeholder: string;
  required: boolean;
}

interface BirthdayStepConfig extends OnboardingStepBase {
  id: 'birthday';
  fieldLabel: string;
  required: boolean;
}

interface SelectionStepConfig extends OnboardingStepBase {
  id: 'gender' | 'orientation' | 'passions';
  selectionMode: SelectionMode;
  options: string[];
}

export type OnboardingStepConfig =
  | NameStepConfig
  | BirthdayStepConfig
  | SelectionStepConfig;

export const onboardingConfig = {
  minimumAge: 18,
  cta: {
    continue: 'Continue',
    finish: 'Finish',
    saving: 'Saving...',
  },
  success: {
    title: 'Onboarding Done',
    subtitle: 'Taking you to Home...',
    navigateDelayMs: 1100,
  },
  validation: {
    nameRequired: 'Please enter your first name.',
    birthdayRequired: 'Please select your birthday.',
    birthdayMinimumAge: (minAge: number) =>
      `You must be at least ${minAge} years old.`,
    genderRequired: 'Please select your gender.',
    orientationRequired: 'Please select your orientation.',
    passionsRequired: 'Please select at least one passion.',
  },
  steps: [
    {
      id: 'name',
      title: 'What is your first name?',
      subtitle: 'This is how people will see you.',
      fieldLabel: 'First Name',
      placeholder: 'First name',
      required: true,
    },
    {
      id: 'birthday',
      title: 'When is your birthday?',
      subtitle: 'We use this to show your age on profile.',
      fieldLabel: 'Birthday',
      required: true,
    },
    {
      id: 'gender',
      title: 'How do you identify?',
      subtitle: 'Pick the option that best matches you.',
      selectionMode: 'single',
      options: ['Woman', 'Man', 'More'],
    },
    {
      id: 'orientation',
      title: 'What is your orientation?',
      subtitle: 'This helps us personalize better matches.',
      selectionMode: 'single',
      options: ['Straight', 'Gay', 'Lesbian', 'Bisexual', 'Asexual'],
    },
    {
      id: 'passions',
      title: 'Pick your passions',
      subtitle: 'Choose interests to make your profile stand out.',
      selectionMode: 'multiple',
      options: ['Music', 'Movies', 'Travel', 'Fitness', 'Cooking', 'Art'],
    },
  ] as OnboardingStepConfig[],
};
