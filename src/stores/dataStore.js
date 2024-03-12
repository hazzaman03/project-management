import { defineStore } from "pinia";
import { useFirestore } from "vuefire";
import {
  collection,
  query,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { getUser } from "@/stores/memberStore.js";

export async function fetchYourProjects() {
  const db = useFirestore();
  const user = await getUser();
  const q = query(collection(db, "Projects"));
  const list = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    if (user.isAdmin) {
      list.push(doc.data());
    } else if (user.name == doc.data().owner.name) {
      list.push(doc.data());
    }
  });
  return list;
}
export async function fetchSharedProjects() {
  const db = useFirestore();
  const user = await getUser();
  const q = query(collection(db, "Projects"));
  const list = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    doc.data().developers.forEach((member) => {
      if (member.name == user.name && doc.data().owner.name != member.name) {
        list.push(doc.data());
      }
    });
    doc.data().viewers.forEach((member) => {
      if (member.name == user.name && doc.data().owner.name != member.name) {
        list.push(doc.data());
      }
    });
  });
  return list;
}

export async function fetchOtherProjects() {
  const db = useFirestore();
  const user = await getUser();
  const q = query(collection(db, "Projects"));
  const list = [];
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let checker = false;
    doc.data().developers.forEach((member) => {
      if (member.name == user.name) {
        checker = true;
      }
    });
    if (!checker) {
      list.push(doc.data());
    }
  });
  return list;
}

export async function addMemberToProject(project, member) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await updateDoc(projectRef, {
    developers: arrayUnion(member),
  });
}

export async function removeMemberFromProject(project, member) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await updateDoc(projectRef, {
    developers: arrayRemove(member),
  });
}

export async function addViewerToProject(project, member) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await updateDoc(projectRef, {
    viewers: arrayUnion(member),
  });
}

export async function removeViewerFromProject(project, member) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await updateDoc(projectRef, {
    viewers: arrayRemove(member),
  });
}

export async function updateProject(project) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await updateDoc(projectRef, {
    description: project.description,
    dueDate: project.dueDate,
  });
}

export async function deleteProjects(project) {
  const db = useFirestore();
  const projectRef = doc(db, "Projects", project.name.replaceAll(" ", ""));
  await deleteDoc(projectRef);
}

export async function newProject(project) {
  const db = useFirestore();
  await setDoc(doc(db, "Projects", project.name.replaceAll(" ", "")), project);
  const userStories = { name: "User Stories" };
  const productBacklog = { name: "Product Backlog" };
  const sprintBacklog = { name: "Sprint Backlog" };
  const completedTasks = { name: "Completed Tasks" };
  const boards = [userStories, productBacklog, sprintBacklog, completedTasks];
  boards.forEach(async (board) => {
    await setDoc(
      doc(
        db,
        "Projects/" +
          project.name.replaceAll(" ", "") +
          "/Boards/" +
          board.name.replaceAll(" ", "")
      ),
      board
    );
  });
}

export async function fetchYourBoards(project) {
  const db = useFirestore();
  const q = query(
    collection(db, "Projects/" + project.replaceAll(" ", "") + "/Boards")
  );
  const list = [];
  const querySnapshot = await getDocs(q);
  for (const board of querySnapshot.docs) {
    let q2 = query(
      collection(
        db,
        "Projects",
        project.replaceAll(" ", ""),
        "Boards",
        board.data().name.replaceAll(" ", ""),
        "Items"
      )
    );
    let querySnapshot2 = await getDocs(q2);
    let itemList = [];
    querySnapshot2.forEach((item) => {
      itemList.push(item.data());
    });
    list.push({ board: board.data(), items: itemList });
  }
  return list;
}

export async function newItem(item, project, board) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    item.name.replaceAll(" ", "")
  );
  await setDoc(projectRef, item);
}

export async function createNewBoard(board, project) {
  const db = useFirestore();
  const newBoard = {
    name: board,
  };
  await setDoc(
    doc(
      db,
      "Projects/" +
        project.replaceAll(" ", "") +
        "/Boards/" +
        board.replaceAll(" ", "")
    ),
    newBoard
  );
}

export async function updateItem(originalItem, newItem, project, board) {
  const db = useFirestore();
  let projectRef = doc(
    db,
    "/Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    originalItem.name.replaceAll(" ", "")
  );
  await deleteDoc(projectRef);

   projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    newItem.name.replaceAll(" ", "")
  );

  await setDoc(projectRef, {
    name: newItem.name,
    description: newItem.description,
    estimate: newItem.estimate,
    dateCreated: newItem.dateCreated,
    dueDate: newItem.dueDate,
    priority: newItem.priority,
    developers: newItem.developers,
    workDone: newItem.workDone,
  });
}

export async function deleteItemFromBoard(project, board, item) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "/Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    item.replaceAll(" ", "")
  );
  await deleteDoc(projectRef);
}

export async function assignDeveloperToItem(project, board, item, developer) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    item.replaceAll(" ", "")
  );
  await updateDoc(projectRef, {
    developers: arrayUnion(developer),
  });
}

export async function addWorkDoneByDeveloper(project, board, item, workDone) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", ""),
    "Items",
    item.replaceAll(" ", "")
  );
  await updateDoc(projectRef, {
    workDone: arrayUnion(workDone),
  });
}

export async function dragBetweenBoards(project, boards) {
  const db = useFirestore();
  const q = query(
    collection(db, "Projects/" + project.replaceAll(" ", "") + "/Boards")
  );
  const querySnapshot = await getDocs(q);
  for (const board of querySnapshot.docs) {
    const q2 = query(
      collection(
        db,
        "Projects/" +
          project.replaceAll(" ", "") +
          "/Boards/" +
          board.data().name.replaceAll(" ", "") +
          "/Items"
      )
    );
    const querySnapshot2 = await getDocs(q2);
    for (const item of querySnapshot2.docs) {
      const projectRef = doc(
        db,
        "Projects/" +
          project.replaceAll(" ", "") +
          "/Boards/" +
          board.data().name.replaceAll(" ", "") +
          "/Items/" +
          item.data().name.replaceAll(" ", "")
      );
      await deleteDoc(projectRef);
    }
  }
  for (const board of boards) {
    for (const item of board.items) {
      const projectRef = doc(
        db,
        "Projects",
        project.replaceAll(" ", ""),
        "Boards",
        board.board.name.replaceAll(" ", ""),
        "Items",
        item.name.replaceAll(" ", "")
      );
      await setDoc(projectRef, {
        name: item.name,
        description: item.description,
        dueDate: item.dueDate,
        dateCreated: item.dateCreated,
        estimate: item.estimate,
        priority: item.priority,
        workDone: item.workDone,
        developers: item.developers,
      });
    }
  }
}

export async function saveEditedBoard(project, oldBoard, newBoard) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    oldBoard.board.name.replaceAll(" ", "")
  );
  await deleteDoc(projectRef);

  const projectRef1 = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    newBoard.replaceAll(" ", "")
  );

  await setDoc(projectRef1, {
    name: newBoard,
  });

  for (const item of oldBoard.items) {
    const projectRef2 = doc(
      db,
      "Projects",
      project.replaceAll(" ", ""),
      "Boards",
      newBoard.replaceAll(" ", ""),
      "Items",
      item.name.replaceAll(" ", "")
    );

    await setDoc(projectRef2, {
      dateCreated: item.dateCreated,
      description: item.description,
      name: item.name,
      developers: item.developers,
      dueDate: item.dueDate,
      estimate: item.estimate,
      priority: item.priority,
      workDone: item.workDone,
    });
  }
}

export async function deleteEditedBoard(project, board) {
  const db = useFirestore();
  const projectRef = doc(
    db,
    "Projects",
    project.replaceAll(" ", ""),
    "Boards",
    board.replaceAll(" ", "")
  );
  await deleteDoc(projectRef);
}

export const useDataStore = defineStore("data", {
  state: () => {
    return { db: useFirestore() };
  },
});
