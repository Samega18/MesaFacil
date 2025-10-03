import React from 'react';
import { Text } from 'react-native';

const createIconSet = () => {
  return function Icon(props) {
    return React.createElement(Text, props, props.name || 'icon');
  };
};

export const AntDesign = createIconSet();
export const Entypo = createIconSet();
export const EvilIcons = createIconSet();
export const Feather = createIconSet();
export const FontAwesome = createIconSet();
export const FontAwesome5 = createIconSet();
export const Fontisto = createIconSet();
export const Foundation = createIconSet();
export const Ionicons = createIconSet();
export const MaterialCommunityIcons = createIconSet();
export const MaterialIcons = createIconSet();
export const Octicons = createIconSet();
export const SimpleLineIcons = createIconSet();
export const Zocial = createIconSet();

export default {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
};