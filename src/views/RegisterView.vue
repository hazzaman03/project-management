<template>
  <div class="login">
    <form @submit.prevent="registerAccount">
      <div class="form-container">
        <div class="form-labels">
          <label for="email">E-mail:</label>
          <label for="first-name">First name:</label>
          <label for="last-name">Last name:</label>
          <label for="password">Enter password:</label>
          <label for="reenter-password">Re-enter password:</label>
        </div>
        <div class="form-inputs">
          <input type="text" id="email" v-model="email" required />
          <input type="text" id="first-name" v-model="firstName" required />
          <input type="text" id="last-name" v-model="lastName" required />
          <input type="password" id="password" v-model="password" required />
          <input type="password" id="reenter-password" v-model="reenterPassword" required />
        </div>
      </div>
      <button type="submit">Create Account</button>
    </form>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script>
import { useFirebaseAuth } from 'vuefire'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@firebase/auth'
import { useMemberStore } from '@/stores/memberStore'

const memberStore = useMemberStore()
const auth = useFirebaseAuth()

export default {
  data() {
    return {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
      reenterPassword: '',
      error: ''
    }
  },
  methods: {
    async registerAccount() {
      var decimal=  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
      if(!this.password.match(decimal)) 
        { 
        alert('Password must be between 8 and 15 characters and must contain a lowercase letter, an uppercase letter, a number, and a special character.')
        return
        }

      if (!(this.password == this.reenterPassword)) {
        alert('Passwords do not match')
        return
      }

      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {
          // Signed in
          console.log(userCredential.user)
          this.signInToFirebase()
          memberStore.addUser(this.firstName, this.lastName, this.email)
          alert('Registered!')
          this.$router.push('/')
        })
        .catch((error) => {
          const errorMessage = error.message
          alert(errorMessage)
          //...
        })
    },
    async signInToFirebase() {
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then((userCredential) => {})
        .catch((error) => {})
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
  width: 80%;
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
  width: 100%;
}

.form-inputs {
  display: flex;
  flex-direction: column;
  gap: 14px;
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
