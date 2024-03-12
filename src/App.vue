<template>
  <nav>
    <div class="container">
      <div class="left-side">
        <img id="logo" src="@/assets/logo.svg" />
        <div>Scrumdidlyumptious</div>
      </div>
      <div class="right-side">
        <router-link to="/">Home | </router-link>
        <router-link to="/projects">Projects | </router-link>
        <router-link to="/board">Boards | </router-link>
        <router-link to="/login" v-if="!user">Login | </router-link>
        <router-link to="/register" v-if="!user">Register</router-link>
        <button @click="logout" v-if="user">Logout</button>
      </div>
    </div>
  </nav>
  <Suspense>
    <router-view />
  </Suspense>
</template>

<script setup>
import { useFirebaseAuth, useCurrentUser } from "vuefire";
import { signOut } from "@firebase/auth";

const user = useCurrentUser();
const auth = useFirebaseAuth();

async function logout() {
  signOut(auth)
    .then(() => {
      alert("Logged out");
      window.location.reload();
    })
    .catch((error) => {
      const errorMessage = error.message;
      alert(errorMessage);
    });
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #cfcfcf;
  font-size: 20px;
  height: 1000px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-height: 100%;
}

.left-side {
  display: flex;
  align-items: center;
  width: 60%;
  gap: 10px;
  font-weight: 600;
}

.right-side {
  width: 40%;
  height: 100%;
  text-align: end;
  margin-right: 50px;
}

nav {
  padding: 1%;
  background-color: #cfcfcf;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
/* Temp */
input {
  border: none;
  font-size: 15px;
  outline: none;
}

body {
  margin: 0;
  overflow: hidden;
}

button {
  all: unset;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
}

a {
  text-decoration: none;
}

#logo {
  max-width: 10%;
  border-radius: 10px;
}
</style>
