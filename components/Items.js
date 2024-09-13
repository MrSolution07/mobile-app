import React from 'react'
import { View,Text } from 'react-native'
import tw from 'twrnc';

const Items = () => {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-medium text-[#075eec]`}>Recently Minted,Purchased or Bid on NFTs</Text>
    </View>
  )
}

export default Items