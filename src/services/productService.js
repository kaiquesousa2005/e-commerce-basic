import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage, auth } from "../Firebase/firebaseConfig"

export const addProduct = async (product, imageFile) => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }

    let imageUrl = product.image
    if (imageFile) {
      const storageRef = ref(storage, `products/${imageFile.name}`)
      await uploadBytes(storageRef, imageFile)
      imageUrl = await getDownloadURL(storageRef)
    }

    const docRef = await addDoc(collection(db, "products"), {
      ...product,
      image: imageUrl,
      userId: user.uid,
      featured: false, 
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding product: ", error)
    throw error
  }
}

export const getProducts = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"))
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting products: ", error)
    throw error
  }
}

export const updateProduct = async (productId, updatedData) => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }
    const productRef = doc(db, "products", productId)
    await updateDoc(productRef, updatedData)
  } catch (error) {
    console.error("Error updating product: ", error)
    throw error
  }
}

export const deleteProduct = async (productId) => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User not authenticated")
    }
    const productRef = doc(db, "products", productId)
    await deleteDoc(productRef)
  } catch (error) {
    console.error("Error deleting product: ", error)
    throw error
  }
}

