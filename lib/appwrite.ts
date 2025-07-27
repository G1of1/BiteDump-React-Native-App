import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, Databases, ID, Query, Storage } from "react-native-appwrite"

//TODO: Figure out how to access .env variables
export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    platform: "com.jsm.bitedump",
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    databaseId: process.env.EXPO_PUBLIC_DATABASE_ID!,
    bucketId: process.env.EXPO_PUBLIC_BUCKET_ID!,
    userCollectionId: process.env.EXPO_PUBLIC_USER_COLLECTION_ID!,
    categoriesCollectionId: process.env.EXPO_PUBLIC_CATEGORIES_COLLECTION_ID!,
    menuCollectionId: process.env.EXPO_PUBLIC_MENU_COLLECTION_ID!,
    customizationsCollectionId: process.env.EXPO_PUBLIC_CUSTOM_COLLECTION_ID!,
    menuCustomizationsCollectionId: process.env.EXPO_PUBLIC_MENU_CUSTOM_COLLECTION_ID!,
}


export const client = new Client();

client.setEndpoint(appwriteConfig.endpoint).setProject(appwriteConfig.projectId).setPlatform(appwriteConfig.platform)

export const account = new Account(client)
export const databases = new Databases(client);

const avatars = new Avatars(client);

export const storage = new Storage(client);

export const createUser = async ({ email, password, name }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name)
        if(!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            { email, name, account_id: newAccount.$id, avatar: avatarUrl }
        );
    } catch (error: any) {
        throw new Error(error as string);
    }
}

export const signIn = async ({email, password} : SignInParams) => {
    try {
        const session = await account.createEmailPasswordSession(email, password);
    }
    catch(error : any) {
        throw new Error(error as string)
    }

}

export const getCurrentUser = async () => {
    try{
        const currentAccount = await account.get();

        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('account_id', currentAccount.$id)]
        )
        if(!currentUser) throw Error;

        return currentUser.documents[0];
    }   
    catch(error: any) {
        throw new Error(error as string)
    }
}