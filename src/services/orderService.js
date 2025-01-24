import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore"
import { db } from "../Firebase/firebaseConfig"

export const createOrder = async (orderData) => {
  try {
    const docRef = await addDoc(collection(db, "orders"), {
      ...orderData,
      status: "pending",
      createdAt: new Date(),
    })
    return docRef.id
  } catch (error) {
    console.error("Error creating order: ", error)
    throw error
  }
}

export const getOrders = async (status = "pending") => {
  try {
    const q = query(collection(db, "orders"), where("status", "==", status))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error("Error getting orders: ", error)
    throw error
  }
}

export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const orderRef = doc(db, "orders", orderId)
    await updateDoc(orderRef, { status: newStatus })
  } catch (error) {
    console.error("Error updating order status: ", error)
    throw error
  }
}

export const deleteOrder = async (orderId) => {
  try {
    const orderRef = doc(db, "orders", orderId)
    await deleteDoc(orderRef)
  } catch (error) {
    console.error("Error deleting order: ", error)
    throw error
  }
}

