import { View, Text, Button, Alert } from 'react-native'
import React, { useState } from 'react'
import { Link, router } from 'expo-router'
import CustomInput from '@/components/CustomInput'
import CustomButton from '@/components/CustomButton'
import { createUser } from '@/lib/appwrite'

const SignUp = () => {
   const [isSumbitting, setIsSumbitting] = useState<boolean>(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  })
  const submit = async () => {
    const {name, email, password } = form;
    
    if(!form.email || !form.password || !form.name) return Alert.alert("Error", "Please enter valid email & password.")
    setIsSumbitting(true);

    try {
      await createUser({name, email, password})
      Alert.alert("Success", "User signed up successfully. Please login t")
      router.replace('/');
    }
    catch(error : any) {
      Alert.alert("Error", error.message)

    }
    finally {
      setIsSumbitting(false);
    }

  }
  return (
    <View className="gap-10 bg-white rounded-lg p-5 mt-5">

      <CustomInput 
        placeholder="Enter your name" 
        value={form.name}
        onChangeText={(text)=> setForm((prev) => ({...prev, name: text}))}
        label="Full Name"
        />
      <CustomInput 
        placeholder="Enter your email" 
        value={form.email}
        onChangeText={(text)=> setForm((prev) => ({...prev, email: text}))}
        label="Email"
        keyboardType='email-address'
        />
        <CustomInput 
        placeholder="Enter your password" 
        value={form.password}
        onChangeText={(text)=> setForm((prev) => ({...prev, password: text}))}
        label="Password"
        secureTextEntry={true}
        />
        <CustomButton title={"Sign Up"} isLoading={isSumbitting} onPress={submit}/>
        <View className="flex justify-center mt-5 flex-row gap-2">
          <Text className="base-regular text-gray-100">Already have an account?</Text>
          <Link href="/SignIn" className="base-bold text-primary">Sign In</Link>
        </View>
    </View>
  )
}

export default SignUp