import { View, Text } from 'react-native'
import { Redirect, Slot } from 'expo-router'

export default function _layout() {
    const isAuthenticated: boolean = false;
    if(!isAuthenticated) return <Redirect href="/(auth)/SignIn" />
  return <Slot/>
}