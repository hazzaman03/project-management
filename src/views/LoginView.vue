<template>
  <div class="login">
    <form @submit.prevent="login">
      <div class="form-container">
        <div class="form-labels">
          <label for="email">Email:</label>
          <label for="password">Password:</label>
        </div>
        <div class="form-inputs">
          <input type="email" id="email" v-model="email" required />
          <input type="password" id="password" v-model="password" required />
        </div>
      </div>
      <button type="submit">Login</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { useFirebaseAuth } from 'vuefire'
import { signInWithEmailAndPassword } from '@firebase/auth'
const auth = useFirebaseAuth()

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    login() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential
          alert('Signed in!')
          this.$router.push('/')
          // ...
        })
        .catch((error) => {
          const errorCode = error.code
          const errorMessage = error.message
          alert(errorMessage)
        })
    }
  }
}
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
  padding: 10%;
  gap: 20px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 30px;
  align-items: center;
}

.form-container {
  display: flex;
  gap: 20px;
}

.form-labels {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: end;
  gap: 10px;
  width: 50%;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 15px;
  justify-content: center;
  width: 50%;
}

button {
  background-color: #007bff;
  color: #fff;
  font-weight: 600;
  border: none;
  max-width: fit-content;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

input {
  border-radius: 5px;
  height: 20px;
  border: 1px solid #000000;
  background-color: rgba(235, 236, 240, 0.5);
}
</style>
