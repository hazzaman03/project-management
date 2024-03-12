<template>
<body>
  <div class="container">
    <div class="left-side">
      <div class="top">
        <div class="big">"THE FUTURE OF PROJECT MANAGEMENT"</div>
        <div class="small">Scrumdiddlyumptious</div>
      </div>
      <div class="middle">
        Scrumdiddlyumptious delivers an online agile project management tool that enables the
        complete and secure collaboration of developers and clients for your next project. The easy
        to use and dynamic application offers value in organising any team for the next project.
      </div>
      <div class="bottom">
        <router-link to="/projects">Projects</router-link> |
        <router-link to="/board">Boards</router-link>
      </div>
    </div>
    <div class="right-side"><img src="../assets/example.png" id="example-image"></div>
  </div>
</body>
</template>

<style scoped>
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #eeeeee;
  font-size: 16px;
  padding: 20px;
  height: 600px;
}

.container {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #eeeeee;
  font-size: 20px;
  display: flex;
  padding: 5%;
}

.right-side {
  display: flex;
  padding: 10px;
}

#example-image {
  max-width: 500px;
}

.left-side {
  display: flex;
  flex-direction: column;
  gap: 30px;
  text-align: center;
  width: 50%;
}

.top {
  text-align: left;
}

.big {
  font-size: 30px;
  font-weight: 800;
  font-style: italic;
}

.small {
  font-size: 20px;
  opacity: 0.8;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

button {
  all: unset;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  font-weight: bold;
  text-decoration: underline;
}

a {
  font-weight: bold;
  color: #42b983;
}
</style>
