<template>
  <body>
    <div
      class="overlay"
      id="burndown-overlay"
      :style="{ display: burndownChartOverlay }"
    >
      <div class="overlay-container">
        <div class="overlay-header">
          <div>Burndown Chart</div>
          <button @click="toggleBurndownChartOverlay(editItemItem)">
            <img src="@/assets/close.png" />
          </button>
        </div>
        <div class="burndown-chart" v-if="burndownChart">
          <canvas id="burndown-chart-chart"> </canvas>
        </div>
      </div>
    </div>

    <div class="overlay" :style="{ display: addItemOverlay }">
      <div class="overlay-container">
        <div class="overlay-header">
          <div>New Item</div>
          <button @click="toggleAddItemOverlay">
            <img src="@/assets/close.png" />
          </button>
        </div>
        <form class="overlay-form" onsubmit="return false">
          <div class="form-components">
            <label for="name">Name: </label>
            <textarea id="name" v-model="addItemName" required />
          </div>
          <div class="form-components">
            <label for="description">Description: </label>
            <textarea id="description" v-model="addItemDescription" />
          </div>
          <div class="form-components">
            <label for="estimate">Estimate (hours): </label>
            <input type="number" id="estimate" v-model="addItemEstimate" />
          </div>
          <div class="form-components">
            <label for="due-date">Priority: </label>
            <select name="Priority" id="new-priority" v-model="addItemPriority">
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <div class="form-components">
            <label for="due-date">Due date (dd/mm/yyyy): </label>
            <textarea id="due-date" v-model="addItemDueDate" />
          </div>
          <div class="overlay-buttons">
            <button class="save" @click="addNewItem" type="submit">
              Create Item
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="overlay" :style="{ display: editItemOverlay }">
      <div class="overlay-container">
        <div class="overlay-header">
          <div>{{ editItemItem.name }}</div>
          <button @click="toggleEditItemOverlay(editItemItem, editItemBoard)">
            <img src="@/assets/close.png" />
          </button>
        </div>
        <form class="overlay-form" onsubmit="return false">
          <div class="form-components">
            <label for="rename">Name: </label>
            <textarea
              id="rename"
              v-model="editItemName"
              :readonly="!permission"
            />
          </div>
          <div class="form-components">
            <label for="description">Description: </label>
            <textarea
              id="description"
              v-model="editItemDescription"
              readonly="!permission"
            />
          </div>
          <div class="form-components">
            <label for="estimate">Estimate (hours): </label>
            <input
              type="number"
              id="estimate"
              v-model="editItemEstimate"
              readonly="!permission"
            />
          </div>
          <div class="form-components">
            <label for="priority">Priority: </label>
            <select
              name="Priority"
              id="new-priority"
              v-model="editItemPriority"
              readonly="!permission"
              v-if="permission"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            <input
              id="priority"
              v-model="editItemPriority"
              readonly="!permission"
              v-else
            />
          </div>
          <div class="form-components">
            <label for="due-date">Due date (dd/mm/yyyy): </label>
            <textarea
              id="due-date"
              v-model="editItemDueDate"
              readonly="!permission"
            />
          </div>
          <div class="form-components">
            <label for="edit-item-developers">Assigned developers: </label>
            <ul v-if="editItemItem.developers.length">
              <li
                id="edit-current-developers"
                v-for="(developer, index) in editItemItem.developers"
                :key="index"
              >
                {{ developer.name }}
              </li>
            </ul>
            <div v-else>No developers</div>
          </div>
          <div class="form-components" v-if="permission">
            <div class="add-container">
              <div id="add-label">
                <label for="add-developer">Assign developer (name): </label>
              </div>
              <div id="add-input">
                <textarea id="add-text" v-model="editItemDeveloper" />
                <button type="button" id="add-button" @click="assignDeveloper">
                  Assign
                </button>
              </div>
            </div>
          </div>
          <div class="form-components">
            <label for="edit-work-done">Work done: </label>
            <ul v-if="editItemItem.workDone.length">
              <li
                id="edit-current-developers"
                v-for="(work, index) in editItemItem.workDone"
                :key="index"
              >
                {{ work.developer.name }}: {{ work.time }} hours on
                {{ work.date }}
              </li>
            </ul>
            <div v-else>No work done</div>
          </div>
          <div class="form-components" v-if="permission">
            <div class="add-container">
              <div id="add-label">
                <label for="add-work">Add work done (hours): </label>
              </div>
              <div id="add-input">
                <textarea id="add-text" v-model="editItemWorkDone" />
                <button type="button" id="add-member-button" @click="addWork">
                  Add
                </button>
              </div>
            </div>
          </div>
          <div class="overlay-buttons">
            <button
              class="save"
              @click="saveItem"
              type="submit"
              v-if="permission"
            >
              Save
            </button>
            <button
              class="delete"
              @click="deleteItem"
              type="submit"
              v-if="permission"
            >
              Delete
            </button>
            <button
              class="save"
              id="generate-chart"
              v-if="
                this.editItemItem.estimate &&
                this.editItemItem.workDone.length &&
                this.editItemItem.dueDate
              "
              @click="toggleBurndownChartOverlay(this.editItemItem)"
            >
              Generate Chart
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="overlay" :style="{ display: editBoardOverlay }">
      <div class="overlay-container">
        <div class="overlay-header">
          <div>{{ editBoardBoard.board.name }}</div>
          <button @click="toggleEditBoardOverlay(editBoardBoard)">
            <img src="@/assets/close.png" />
          </button>
        </div>
        <form class="overlay-form" onsubmit="return false">
          <div class="form-components">
            <label for="name">Name: </label>
            <textarea id="name" v-model="editBoardName" required />
          </div>
          <div class="overlay-buttons">
            <button class="save" @click="saveBoard" type="submit">Save</button>
            <button class="delete" @click="deleteBoard" type="submit">
              Delete
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="header">
      <div class="header-title">Select Project:</div>
      <div class="header-selection">
        <select
          name="Project"
          id="select-project"
          v-model="selectedProjectString"
        >
          <option hidden disabled selected value>-- select an option --</option>
          <option
            v-for="(project, index) in projects"
            :key="index"
            :value="project.name.replace(' ', '')"
          >
            {{ project.name }}
          </option>
        </select>
        <button id="project-selection" @click="fetchBoards">
          <img id="tick" src="@/assets/tick.png" />
        </button>
      </div>
    </div>

    <hr />

    <div id="not-selected" v-if="!boards.length">No boards to show ...</div>

    <div v-else>
      <div class="new-board" v-if="permission">
        <div>Enter board name:</div>
        <form class="new-board-form" @submit.prevent="newBoard">
          <input type="text" v-model="newBoardName" />
          <button class="save" id="create-board" type="submit">
            Create Board
          </button>
        </form>
      </div>
      <div class="boards-container">
        <div
          class="board"
          v-for="(board, boardIndex) in boards"
          :key="boardIndex"
        >
          <div class="board-header">
            <div class="board-title">{{ board.board.name }}</div>
            <button @click="toggleEditBoardOverlay(board)" v-if="permission">
              <img id="edit-board-button" src="@/assets/edit.png" />
            </button>
            <button
              @click="toggleAddItemOverlay(board.board.name)"
              v-if="permission"
            >
              <img id="new-project-button" src="@/assets/add.png" />
            </button>
          </div>
          <draggable
            class="board-items"
            :list="board.items"
            group="items"
            itemKey="items"
            @change="log"
            :disabled="!permission"
          >
            <template #item="{ element }">
              <div class="items">
                <div class="item-name">{{ element.name }}</div>
                <div
                  :style="{ 'background-color': getColor(element.priority) }"
                  class="priority"
                ></div>
                <button @click="toggleEditItemOverlay(element, board)">
                  <img src="@/assets/edit.png" />
                </button>
              </div>
            </template>
          </draggable>
        </div>
      </div>
    </div>
  </body>
</template>

<script>
import {
  fetchYourProjects,
  fetchSharedProjects,
  fetchYourBoards,
  newItem,
  createNewBoard,
  updateItem,
  assignDeveloperToItem,
  addWorkDoneByDeveloper,
  deleteItemFromBoard,
  dragBetweenBoards,
  saveEditedBoard,
  deleteEditedBoard,
} from "@/stores/dataStore.js";
import { getProjectUsers, getUser } from "@/stores/memberStore.js";
import draggable from "vuedraggable";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";

const yourProjects = await fetchYourProjects();
const sharedProjects = await fetchSharedProjects();
const user = await getUser();
const defaultItem = {
  name: "",
  description: "",
  estimate: "",
  dateCreated: "",
  dueDate: "",
  priority: "",
  developers: [],
  workDone: [],
};
const defaultBoard = {
  board: {
    name: "",
  },
  items: [],
};

export default {
  components: {
    draggable,
  },
  data() {
    return {
      projects: yourProjects.concat(sharedProjects),
      selectedProjectString: "",
      user: user,
      projectUsers: [],
      permission: false,
      boards: [],
      lists: [],
      addItemBoard: "",
      addItemOverlay: "none",
      addItemName: "",
      addItemDescription: "",
      addItemEstimate: "",
      addItemDueDate: "",
      addItemPriority: "",
      newBoardName: "",
      editItemBoard: "",
      editItemItem: defaultItem,
      editItemOverlay: "none",
      editItemName: "",
      editItemDescription: "",
      editItemEstimate: "",
      editItemDueDate: "",
      editItemPriority: "",
      editItemWorkDone: "",
      editItemWorkDoneArray: [],
      editItemDeveloper: "",
      editItemDeveloperArray: [],
      editBoardOverlay: "none",
      editBoardBoard: defaultBoard,
      editBoardName: "",
      burndownChartOverlay: "none",
      burndownChart: [],
    };
  },
  methods: {
    log() {
      this.boards.forEach(async (board) => {
        await dragBetweenBoards(this.selectedProjectString, this.boards);
      });
    },
    async fetchBoards() {
      this.boards = await fetchYourBoards(this.selectedProjectString);
      this.projectUsers = await getProjectUsers(this.selectedProjectString);
      this.permission = false;
      this.projectUsers.forEach((member) => {
        if (member.name == this.user.name) {
          this.permission = true;
        }
      });
      this.permission = this.user.isAdmin
        ? (this.permission = true)
        : this.permission;
    },
    getColor(priority) {
      if (priority === "") {
        return "#C2C2C2";
      } else if (priority === "Low") {
        return "#FFDE00";
      } else if (priority === "Medium") {
        return "#F36800";
      } else if (priority === "High") {
        return "#D00505";
      }
    },
    toggleAddItemOverlay(name) {
      this.addItemOverlay == "none"
        ? (this.addItemOverlay = "flex")
        : (this.addItemOverlay = "none");
      this.addItemBoard = name;
      this.addItemName = "";
      this.addItemDescription = "";
      this.addItemEstimate = "";
      this.addItemDueDate = "";
      this.addItemPriority = "";
    },
    toggleEditItemOverlay(item, board) {
      this.editItemOverlay == "none"
        ? (this.editItemOverlay = "flex")
        : (this.editItemOverlay = "none");
      this.editItemBoard = board;
      this.editItemItem = item;
      this.editItemName = item.name;
      this.editItemDescription = item.description;
      this.editItemEstimate = item.estimate;
      this.editItemDueDate = item.dueDate;
      this.editItemPriority = item.priority;
      this.editItemWorkDone = "";
      this.editItemWorkDoneArray = item.workDone;
      this.editItemDeveloper = "";
      this.editItemDeveloperArray = item.developers;
    },
    toggleEditBoardOverlay(board) {
      this.editBoardOverlay == "none"
        ? (this.editBoardOverlay = "flex")
        : (this.editBoardOverlay = "none");
      this.editBoardBoard = board;
      this.editBoardName = board.board.name;
    },
    async toggleBurndownChartOverlay(item) {
      try {
        this.burndownChart.destroy();
      } catch {
        // do nothing
      }
      this.editItemOverlay = "none";
      this.burndownChartOverlay == "none"
        ? (this.burndownChartOverlay = "flex")
        : (this.burndownChartOverlay = "none");

      function formatDate(date) {
        const dateSplit = date.split("/");
        const reversedSplit = dateSplit.reverse();
        return reversedSplit.join("-");
      }

      const estimateData = [
        { x: formatDate(item.dateCreated), y: item.estimate },
        { x: formatDate(item.dueDate), y: 0 },
      ];
      const actualData = [
        { x: formatDate(item.dateCreated), y: item.estimate },
      ];
      let previousWork = item.estimate;
      for (const work of item.workDone) {
        actualData.push({
          x: formatDate(work.date),
          y: previousWork - parseInt(work.time),
        });
        previousWork = previousWork - parseInt(work.time);
      }
      this.burndownChart = new Chart(
        document.getElementById("burndown-chart-chart"),
        {
          type: "line",
          data: {
            datasets: [
              {
                data: estimateData,
                label: "Estimate",
              },
              {
                data: actualData,
                label: "Actual",
              },
            ],
          },
          options: {
            scales: {
              x: {
                type: "time",
                time: {
                  unit: "day",
                },
                title: {
                  display: true,
                  text: "Date",
                  font: {
                    weight: 700,
                    size: 20,
                  },
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Hours remaining",
                  font: {
                    weight: 700,
                    size: 20,
                  },
                },
              },
            },
            plugins: {
              legend: {
                labels: {
                  font: {
                    weight: 700,
                    size: 20,
                  },
                },
              },
            },
          },
        }
      );
    },
    async addNewItem() {
      const cardItem = {
        name: this.addItemName,
        description: this.addItemDescription,
        estimate: this.addItemEstimate,
        dateCreated: new Date(Date.now()).toLocaleDateString("en-GB"),
        dueDate: this.addItemDueDate,
        priority: this.addItemPriority,
        developers: [],
        workDone: [],
      };
      await newItem(cardItem, this.selectedProjectString, this.addItemBoard);
      this.addItemName = "";
      this.addItemDescription = "";
      this.addItemEstimate = "";
      this.addItemDueDate = "";
      this.addItemPriority = "";
      this.addItemOverlay = "none";
      this.boards = await fetchYourBoards(this.selectedProjectString);
    },
    async newBoard() {
      await createNewBoard(this.newBoardName, this.selectedProjectString);
      this.newBoardName = "";
      this.boards = await fetchYourBoards(this.selectedProjectString);
    },
    async saveItem() {
      const newItem = {
        name: this.editItemName,
        description: this.editItemDescription,
        estimate: this.editItemEstimate,
        dateCreated: this.editItemItem.dateCreated,
        dueDate: this.editItemDueDate,
        priority: this.editItemPriority,
        developers: this.editItemItem.developers,
        workDone: this.editItemItem.workDone,
      };
      await updateItem(
        this.editItemItem,
        newItem,
        this.selectedProjectString,
        this.editItemBoard.board.name
      );
      this.editItemItem = defaultItem;
      this.editItemName = "";
      this.editItemDescription = "";
      this.editItemEstimate = "";
      this.editItemDueDate = "";
      this.editItemPriority = "";
      this.editItemWorkDone = "";
      this.editItemDeveloper = "";
      this.editItemOverlay = "none";
      this.boards = await fetchYourBoards(this.selectedProjectString);
    },
    async deleteItem() {
      await deleteItemFromBoard(
        this.selectedProjectString,
        this.editItemBoard.board.name,
        this.editItemItem.name
      );
      this.editItemItem = defaultItem;
      this.editItemName = "";
      this.editItemDescription = "";
      this.editItemEstimate = "";
      this.editItemDueDate = "";
      this.editItemPriority = "";
      this.editItemWorkDone = "";
      this.editItemDeveloper = "";
      this.editItemOverlay = "none";
      this.boards = await fetchYourBoards(this.selectedProjectString);
    },
    async assignDeveloper() {
      let alreadyInChecker = false;
      this.editItemItem.developers.forEach((member) => {
        if (member.name == this.editItemDeveloper) {
          alreadyInChecker = true;
        }
      });

      let existsChecker = false;
      this.projectUsers.forEach((member) => {
        if (member.name == this.editItemDeveloper) {
          existsChecker = true;
        }
      });

      if (!alreadyInChecker && existsChecker) {
        this.projectUsers.forEach(async (member) => {
          if (member.name == this.editItemDeveloper) {
            await assignDeveloperToItem(
              this.selectedProjectString,
              this.editItemBoard.board.name,
              this.editItemItem.name,
              member
            );
            this.editItemDeveloperArray.push(member);
            this.editItemDeveloper = "";
          }
        });
      } else {
        alert("Developer is not in the project or is already assigned");
      }
    },
    async addWork() {
      const workDone = {
        developer: this.user,
        time: this.editItemWorkDone,
        date: new Date(Date.now()).toLocaleDateString("en-GB"),
      };
      this.editItemWorkDoneArray.push(workDone);
      await addWorkDoneByDeveloper(
        this.selectedProjectString,
        this.editItemBoard.board.name,
        this.editItemItem.name,
        workDone
      );
    },
    async saveBoard() {
      await saveEditedBoard(
        this.selectedProjectString,
        this.editBoardBoard,
        this.editBoardName
      );
      this.editBoardBoard = defaultBoard;
      this.editBoardName = "";
      this.editBoardOverlay = "none";
      this.boards = await fetchYourBoards(this.selectedProjectString);
    },

    async deleteBoard() {
      await deleteEditedBoard(
        this.selectedProjectString,
        this.editBoardBoard.board.name
      );
      this.boards = await fetchYourBoards(this.selectedProjectString);
      this.editBoardOverlay = "none";
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
  font-size: 16px;
  padding: 20px;
  height: auto;
}

.new-board {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
}

.new-board-form {
  display: flex;
  align-items: center;
}

#create-board {
  height: 20px;
  padding: 10px;
}

.header {
  display: flex;
  font-weight: bold;
  gap: 10px;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}

.header-selection {
  display: flex;
  gap: 10px;
  height: 35px;
}

#tick {
  width: 25px;
  border-radius: 5px;
}

#project-selection {
  justify-content: center;
}

#select-project {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  border-radius: 5px;
  border: 1px solid #000000;
  background-color: rgba(235, 236, 240, 0.5);
  resize: none;
  align-items: center;
  text-align: center;
  font-size: 20px;
}

.overlay {
  display: none;
  position: fixed;
  padding: 10px;
  width: 500px;
  left: 45%;
  margin-left: -150px;
  height: auto;
  top: auto;
  margin-top: -100px;
  background: #fff;
  z-index: 20;
  -webkit-box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 0px 0px 9999px rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  padding: 1%;
}

#burndown-overlay {
  left: 17%;
  width: 80%;
  height: 80%;
}

.burndown-chart {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
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
  font-size: 18px;
}

.overlay-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-components {
  display: flex;
  text-align: center;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

label {
  text-align: end;
}
textarea {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  border-radius: 5px;
  height: 25px;
  border: 1px solid #000000;
  background-color: rgba(235, 236, 240, 0.5);
  resize: none;
  width: 50%;
  align-items: center;
  text-align: center;
}

input {
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
.add-container {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

#add-input {
  width: 50%;
}
#add-text {
  width: 99%;
}

#new-priority {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  border-radius: 5px;
  height: 25px;
  border: 1px solid #000000;
  background-color: rgba(235, 236, 240, 0.5);
  resize: none;
  width: 51%;
  align-items: center;
  text-align: center;
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

#description {
  height: 50px;
}
#new-project-button {
  border-radius: 20px;
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

img {
  max-width: 35px;
}

.board-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
}

.boards-container {
  display: flex;
  gap: 30px;
  padding: 1%;
  justify-content: center;
}

.board {
  display: flex;
  flex-direction: column;
  gap: 15px;
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  width: 20%;
}

.board-title {
  font-weight: bold;
}

.board-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.items {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: rgba(235, 236, 240, 0.5);
  padding: 5px;
  border: 1px solid #000000;
  border-radius: 5px;
}

.items:hover {
  cursor: grab;
}

.items:active {
  cursor: grabbing;
}

.priority {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: 10px;
}
</style>
