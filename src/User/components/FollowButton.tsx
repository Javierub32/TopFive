import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FollowButtonProps {
  isFollowed: boolean;
  isRequested: boolean;
  handleFollow: () => void;
  cancelRequest?: () => void;
}

export function FollowButton({
  isFollowed,
  isRequested,
  handleFollow,
  cancelRequest,
}: FollowButtonProps) {
  if (!isFollowed && !isRequested) {
    return (
      <View className='flex items-center'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md bg-[#4150f7] py-2"
          onPress={handleFollow}>
          <Text className="font-semibold text-white">Seguir</Text>
        </TouchableOpacity>
      </View>
    );
  }
  if (!isFollowed && isRequested) {
    return (
      <View className='flex items-center'>
        <TouchableOpacity
          className="items-center px-4 flex w-2/3 rounded-md bg-surfaceButton py-2"
          onPress={cancelRequest}>
          <Text className="font-semibold text-white">Solicitud enviada</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return null;
}
