import {ScrollView, View, Image, Pressable} from 'react-native';
import {createStyleSheet} from './style';
import {BigText} from '../home/components/BigText';
import {SmallText} from '../home/components/SmallText';
import {LineItems} from '../home/components/LineItems';
import {CardComponent} from '../../components/CardComponent';
import {Header} from '../../components/Header';
import {useEffect, useState} from 'react';
import {useMatchedUserData} from '../../api/match';

export const ViewOnlyProfile = ({route}: {route: unknown}) => {
  const [profileData, setProfileData] = useState([]);
  const styles = createStyleSheet();

  useEffect(() => {
    useMatchedUserData().then(res => {
      setProfileData(res?.data);
      console.log('res', res);
    });
  }, []);

  const getCurrentSection = (user: unknown) => {
    switch (user?.type) {
      case 'BIG_TEXT':
        return <BigText title={user?.title} content={user?.content} />;
      case 'SMALL_TEXT':
        return <SmallText title={user?.title} content={user?.content} />;
      case 'SMALL_TEXT_LIST':
        return <LineItems title={user?.title} content={user?.content} />;
    }
  };

  return (
    <>
      <Header />
      <ScrollView contentContainerStyle={styles.background}>
        {/* <>
          <CardComponent viewStyle={{padding: 0}}>
            <Image
              source={{
                uri:
                  'https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/s/d/v/medium-anime-girls-fantasy-anime-girls-hd-matte-finish-poster-original-imagh8k9taqepyzs.jpeg?q=90&crop=false' ||
                  undefined,
              }}
              style={[styles.image]}
            />
          </CardComponent>
          <View style={{overflow: 'visible', gap: 8, marginTop: 8}}>
            {!!profileData && profileData?.map(user => getCurrentSection(user))}
          </View>
        </> */}
        <CardComponent viewStyle={styles.container}>
          <View style={styles.imageContainer}>
            <Pressable>
              <Image
                source={{
                  uri: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/s/d/v/medium-anime-girls-fantasy-anime-girls-hd-matte-finish-poster-original-imagh8k9taqepyzs.jpeg?q=90&crop=false',
                }}
                style={[styles.profileImage]}
              />
            </Pressable>
          </View>

          {/* Profile Info */}
          <View style={styles.profileInfo}>
            {!!profileData &&
              profileData?.map(user => {
                return (
                  <View>
                    {getCurrentSection(user)}
                    <View style={styles.seperator} />
                  </View>
                );
              })}
          </View>
        </CardComponent>
      </ScrollView>
    </>
  );
};
