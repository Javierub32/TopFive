import {  Pressable, View} from 'react-native';
import { iconAdapter } from '../adapters/iconAdapter';
import { useTheme } from 'context/ThemeContext';
import { RESOURCE_TYPES, ResourceType } from 'hooks/useResource';

interface Props {
  selected: ResourceType;
  onSelect: (cat: ResourceType) => void;
}


export const CategorySelector = ({ selected, onSelect }: Props) => {
  const { colors } = useTheme();

  return (
    <View
      className="mb-4 flex-row justify-between"
      style={{ borderBottomWidth: 1, borderBottomColor: colors.placeholderText }}
    >

      {RESOURCE_TYPES.map((cat) => {
        const IconComponent = iconAdapter.getIcon(cat);

        return(
          <Pressable key={cat} onPress={()=> onSelect(cat)}>
          <View className="px-6 py-2" style={selected === cat ? {borderBottomWidth: 4, borderBottomColor: colors.primary} : {}}>
            <IconComponent color={selected === cat ? colors.primary : colors.secondaryText} />
          </View>

        </Pressable>
        );
      })}
        
        
    </View>
  );
}