import { defineStore } from "pinia";
import {
  doc,
  setDoc,
  query,
  collection,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useCurrentUser, useFirestore } from "vuefire";

export async function getUser() {
  const db = useFirestore();
  const user = useCurrentUser();
  const q = query(collection(db, "Members"));
  const querySnapshot = await getDocs(q);
  let selected = null;

  querySnapshot.forEach((member) => {
    if (member.data().email == user.value.email) {
      selected = member.data();
    }
  });
  return selected;
}

export async function getAllUsers() {
  const db = useFirestore();
  const q = query(collection(db, "Members"));
  const querySnapshot = await getDocs(q);
  const selected = [];

  querySnapshot.forEach((member) => {
    if (!member.data().isAdmin) {
      selected.push(member.data());
    }
  });
  return selected;
}

export async function getProjectUsers(project) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.replace(" ", ""));
  const data = await getDoc(projectRef);
  const list = [];
  data.data().developers.forEach((member) => {
    list.push(member);
  });
  list.push(data.data().owner);
  return list;
}

export const useMemberStore = defineStore("data", {
  state: () => {
    return { db: useFirestore(), currentUser: null };
  },
  actions: {
    async addUser(firstName, lastName, eMail) {
      const newDoc = await setDoc(
        doc(this.db, "Members", firstName + lastName),
        {
          name: firstName + " " + lastName,
          email: eMail,
          isAdmin: false,
        }
      );
    },
  },
});
