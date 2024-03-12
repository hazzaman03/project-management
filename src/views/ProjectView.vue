<template>
  <body>
    <div v-if="yourProjects.length">
      <div class="overlay" :style="{ display: isEditOverlay }">
        <div class="overlay-container">
          <div class="overlay-header">
            <div>{{ editingProject.name }}</div>
            <button @click="toggleEditOverlay(editingProject)">
              <img src="@/assets/close.png" />
            </button>
          </div>
          <form class="overlay-form" onsubmit="return false">
            <div class="form-components">
              <label for="description">Description: </label>
              <textarea
                id="description"
                v-model="editingProject.description"
                required
              />
            </div>
            <div class="form-components">
              <label for="edit-due-date">Due date (dd/mm/yyyy): </label>
              <textarea
                id="edit-due-date"
                v-model="editingProject.dueDate"
                required
              />
            </div>
            <div class="form-components">
              <label for="edit-current-developers">Current developers: </label>
              <ul v-if="editingProject.developers.length">
                <li
                  id="edit-current-developers"
                  v-for="(developer, index) in editingProject.developers"
                  :key="index"
                >
                  {{ developer.name }}
                  <button @click="removeMember(developer)">| Remove</button>
                </li>
              </ul>
              <div v-else>No developers</div>
            </div>
            <div class="form-components">
              <div class="add-member-container">
                <div id="add-member-label">
                  <label for="edit-add-member">Add member (name): </label>
                </div>
                <div id="add-member-input">
                  <textarea id="edit-add-member" v-model="editedMember" />
                  <button
                    type="button"
                    id="add-member-button"
                    @click="addMember"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div class="form-components">
              <label for="edit-current-developers">Current viewers: </label>
              <ul v-if="editingProject.viewers.length">
                <li
                  id="edit-current-developers"
                  v-for="(viewer, index) in editingProject.viewers"
                  :key="index"
                >
                  {{ viewer.name }}
                  <button @click="removeViewer(viewer)">| Remove</button>
                </li>
              </ul>
              <div v-else>No Viewers</div>
            </div>
            <div class="form-components">
              <div class="add-member-container">
                <div id="add-member-label">
                  <label for="edit-add-member">Add Viewer (name): </label>
                </div>
                <div id="add-member-input">
                  <textarea id="edit-add-member" v-model="editedViewer" />
                  <button
                    type="button"
                    id="add-member-button"
                    @click="addViewer"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div class="overlay-buttons">
              <button class="save" @click="saveProject" type="submit">
                Save
              </button>
              <button class="delete" @click="deleteProject" type="submit">
                Delete
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="overlay" :style="{ display: isNewOverlay }">
      <div class="overlay-container">
        <div class="overlay-header">
          <div>New Project</div>
          <button @click="toggleNewOverlay">
            <img src="@/assets/close.png" />
          </button>
        </div>
        <form class="overlay-form" @submit.prevent="newProject">
          <div class="form-components">
            <label for="name">Name: </label>
            <textarea id="name" v-model="newName" required />
          </div>
          <div class="form-components">
            <label for="description">Description: </label>
            <textarea id="description" v-model="newDescription" required />
          </div>
          <div class="form-components">
            <label for="due-date">Due date (dd/mm/yyyy): </label>
            <textarea id="due-date" v-model="newDueDate" required />
          </div>
          <div class="overlay-buttons">
            <button class="save" type="submit">Create Project</button>
          </div>
        </form>
      </div>
    </div>

    <div class="project-wrapper">
      <div class="your-project-header">
        <div class="title">
          {{ user.isAdmin ? "All Projects" : "Your Projects" }}
        </div>
        <div class="new-project">
          <div class="new-project-title">New Project</div>
          <div class="new-project-button">
            <button @click="toggleNewOverlay">
              <img id="new-project-button" src="@/assets/add.png" />
            </button>
          </div>
        </div>
      </div>
      <div class="outer-container" v-if="yourProjects.length">
        <div
          class="project-container"
          v-for="(project, index) in yourProjects"
          :key="index"
        >
          <div class="project-header">
            <div class="project-title">{{ project.name }}</div>
            <button @click="toggleEditOverlay(project, index)">
              <img src="@/assets/edit.png" />
            </button>
          </div>
          <div class="project-description">
            <strong>Description: </strong>{{ project.description }}
          </div>
          <div class="project-dateCreated">
            <strong>Date created: </strong>
            {{ project.dateCreated }}
          </div>
          <div class="project-dueDate">
            <strong>Due date: </strong>{{ project.dueDate }}
          </div>
          <div class="project-owner">
            <strong>Owner: </strong> {{ project.owner.name }}
          </div>
        </div>
      </div>
      <div class="no-projects" v-else>No owned projects ...</div>
    </div>

    <hr v-if="!user.isAdmin" />
    <div class="project-wrapper" v-if="!user.isAdmin">
      <div class="title">Shared projects</div>
      <div class="outer-container" v-if="sharedProjects.length">
        <div
          class="project-container"
          v-for="(project, index) in sharedProjects"
          :key="index"
        >
          <div class="project-title">{{ project.name }}</div>
          <div class="project-description">
            <strong>Description: </strong>{{ project.description }}
          </div>
          <div class="project-dateCreated">
            <strong>Date created: </strong>
            {{ project.dateCreated }}
          </div>
          <div class="project-dueDate">
            <strong>Due date: </strong>{{ project.dueDate }}
          </div>
          <div class="project-owner">
            <strong>Owner: </strong> {{ project.owner.name }}
          </div>
        </div>
      </div>
      <div class="no-projects" v-else>No shared projects ...</div>
    </div>

    <hr v-if="!user.isAdmin" />
    <div class="project-wrapper" v-if="!user.isAdmin">
      <div class="title">Other projects</div>
      <div class="outer-container" v-if="otherProjects.length">
        <div
          class="project-container"
          v-for="(project, index) in otherProjects"
          :key="index"
        >
          <div class="project-title">{{ project.name }}</div>
          <div class="project-description">
            <strong>Description: </strong>{{ project.description }}
          </div>
          <div class="project-dateCreated">
            <strong>Date created:</strong>
            {{ project.dateCreated }}
          </div>
          <div class="project-dueDate">
            <strong>Due date: </strong>{{ project.dueDate }}
          </div>
          <div class="project-owner">
            <strong>Owner: </strong> {{ project.owner.name }}
          </div>
        </div>
      </div>
      <div class="no-projects" v-else>No other projects ...</div>
    </div>
  </body>
</template>

<script>
import {
  fetchYourProjects,
  fetchSharedProjects,
  fetchOtherProjects,
  addMemberToProject,
  removeMemberFromProject,
  addViewerToProject,
  removeViewerFromProject,
  updateProject,
  deleteProjects,
  newProject,
} from "@/stores/dataStore.js";
import { getUser, getAllUsers } from "@/stores/memberStore.js";

const yourProjects = await fetchYourProjects();
const sharedProjects = await fetchSharedProjects();
const otherProjects = await fetchOtherProjects();

const allUser = await getAllUsers();
const currentUser = await getUser();

const defaultProject = {
  name: "project",
  description: "project",
  dueDate: new Date(Date.now()),
  developers: "project",
  viewers: "project",
};

export default {
  data() {
    return {
      yourProjects: yourProjects,
      sharedProjects: sharedProjects,
      otherProjects: otherProjects,
      user: currentUser,
      allUsers: allUser,
      isEditOverlay: "none",
      editingProject: defaultProject,
      editedMember: "",
      editedViewer: "",
      isNewOverlay: "none",
      newName: "",
      newDescription: "",
      newDueDate: "",
      newMember: "",
    };
  },
  methods: {
    async toggleEditOverlay(project) {
      if (this.isEditOverlay == "none") {
        this.isEditOverlay = "flex";
      } else {
        this.isEditOverlay = "none";
      }
      this.editingProject = project;

      this.yourProjects = await fetchYourProjects();
      this.sharedProjects = await fetchSharedProjects();
      this.otherProjects = await fetchOtherProjects();
    },
    async toggleNewOverlay() {
      if (this.isNewOverlay == "none") {
        this.isNewOverlay = "flex";
      } else {
        this.isNewOverlay = "none";
      }
      this.newName = "";
      this.newDescription = "";
      this.newDueDate = "";

      this.yourProjects = await fetchYourProjects();
      this.sharedProjects = await fetchSharedProjects();
      this.otherProjects = await fetchOtherProjects();
    },
    async addMember() {
      let existsChecker = false;
      this.allUsers.forEach((member) => {
        if (this.editedMember == member.name) {
          existsChecker = true;
        }
      });
      let alreadyInChecker = false;
      this.editingProject.developers.forEach((member) => {
        if (member.name == this.editedMember) {
          alreadyInChecker = true;
        }
      });
      this.editingProject.viewers.forEach((member) => {
        if (member.name == this.editedMember) {
          alreadyInChecker = true;
        }
      });

      if (existsChecker && !alreadyInChecker) {
        this.allUsers.forEach(async (member) => {
          if (member.name == this.editedMember) {
            await addMemberToProject(this.editingProject, member);
            this.editingProject.developers.push(member);
            this.editedMember = "";
          }
        });
      } else {
        alert("Member does not exist or is already in the project");
      }
    },
    async removeMember(member) {
      await removeMemberFromProject(this.editingProject, member);
      this.editingProject.developers.splice(
        this.editingProject.developers.indexOf(member)
      );
    },
    async addViewer() {
      let existsChecker = false;
      this.allUsers.forEach((member) => {
        if (this.editedViewer == member.name) {
          existsChecker = true;
        }
      });
      let alreadyInChecker = false;
      this.editingProject.developers.forEach((member) => {
        if (member.name == this.editedMember) {
          alreadyInChecker = true;
        }
      });
      this.editingProject.viewers.forEach((member) => {
        if (member.name == this.editedMember) {
          alreadyInChecker = true;
        }
      });
      if (existsChecker && !alreadyInChecker) {
        this.allUsers.forEach(async (member) => {
          if (member.name == this.editedViewer) {
            await addViewerToProject(this.editingProject, member);
            this.editingProject.viewers.push(member);
            this.editedViewer = "";
          }
        });
      } else {
        alert("Member does not exist or is already in the project");
      }
    },
    async removeViewer(member) {
      await removeViewerFromProject(this.editingProject, member);
      this.editingProject.viewers.splice(
        this.editingProject.viewers.indexOf(member)
      );
    },
    async saveProject() {
      await updateProject(this.editingProject);
      this.isEditOverlay = "none";
      this.yourProjects = await fetchYourProjects();
      this.sharedProjects = await fetchSharedProjects();
      this.otherProjects = await fetchOtherProjects();
    },
    async deleteProject() {
      await deleteProjects(this.editingProject);
      this.isEditOverlay = "none";
      this.yourProjects = await fetchYourProjects();
      this.sharedProjects = await fetchSharedProjects();
      this.otherProjects = await fetchOtherProjects();
    },
    async newProject() {
      const dateCreated = new Date(Date.now());
      const dateCreatedFormat = dateCreated.toLocaleDateString("en-GB");
      const projectMap = {
        name: this.newName,
        description: this.newDescription,
        dueDate: this.newDueDate,
        developers: this.user.isAdmin ? [] : [this.user],
        owner: this.user,
        viewers: [],
        dateCreated: dateCreatedFormat,
      };
      await newProject(projectMap);

      this.yourProjects = await fetchYourProjects();
      this.sharedProjects = await fetchSharedProjects();
      this.otherProjects = await fetchOtherProjects();
      this.newName = "";
      this.newDescription = "";
      this.newDueDate = "";
      this.isNewOverlay = "none";
    },
  },
};
</script>

<style scoped>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #eeeeee;
  font-size: 20px;
  padding: 20px;
  height: auto;
  overflow: scroll;
}

.overlay {
  display: none;
  position: fixed;
  padding: 10px;
  width: 600px;
  left: 45%;
  margin-left: -150px;
  height: auto;
  top: 25%;
  margin-top: -100px;
  background: #fff;
  z-index: 20;
  -webkit-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 1%;
}

.overlay-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.overlay-header {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.overlay-form {
  display: flex;
  flex-direction: column;
  gap: 50px;
}

.form-components {
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

label {
  text-align: start;
}

.add-member-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#add-member-input {
  width: 50%;
}
#edit-add-member {
  width: 99%;
}

textarea {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  border-radius: 5px;
  height: 20px;
  border: 1px solid #000000;
  background-color: rgba(235, 236, 240, 0.5);
  resize: none;
  width: 50%;
  align-items: center;
  text-align: center;
}

#description {
  height: 50px;
}

.your-project-header {
  display: flex;
  justify-content: space-between;
}

.new-project {
  display: flex;
  gap: 10px;
  align-items: center;
}

#new-project-button {
  max-width: 30px;
  border-radius: 20px;
}

ul {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  font-size: 14px;
  width: 50%;
}

.overlay-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.save {
  background-color: rgba(1, 100, 255, 1);
  display: flex;
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 15px;
  cursor: pointer;
  transition-duration: 0.4s;
}

.save:hover {
  background-color: rgba(1, 100, 255, 0.8);
}

.delete {
  background-color: rgba(250, 52, 75, 1);
  display: flex;
  border: none;
  color: white;
  padding: 15px 32px;
  margin: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 15px;
  cursor: pointer;
  transition-duration: 0.4s;
}
.delete:hover {
  background-color: rgba(250, 52, 75, 0.8);
}

.title {
  font-weight: bold;
}

.no-projects {
  opacity: 50%;
}

.project-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 0;
}

.project-container {
  display: flex;
  flex-direction: column;
  padding: 10px;
  background-color: white;
  width: 20%;
  gap: 10px;
  border-radius: 10px;
  font-size: 14px;
}

.outer-container {
  display: flex;
  gap: 20px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.project-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 10px;
}

img {
  max-width: 40px;
}
</style>
