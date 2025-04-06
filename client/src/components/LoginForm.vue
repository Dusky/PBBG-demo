<template>
  <div class="login-form">
    <div class="form-container">
      <h1>{{ isRegister ? 'Register' : 'Login' }}</h1>
      
      <div class="form-group">
        <label for="username">Username</label>
        <input 
          id="username"
          v-model="formData.username"
          type="text"
          placeholder="Enter your username"
          @input="clearFieldError('username')"
          :class="{ 'input-error': fieldErrors.username }"
          required
        />
        <div class="field-error" v-if="fieldErrors.username">
          {{ fieldErrors.username }}
        </div>
      </div>
      
      <div class="form-group" v-if="isRegister">
        <label for="email">Email</label>
        <input 
          id="email"
          v-model="formData.email"
          type="email"
          placeholder="Enter your email"
          @input="clearFieldError('email')"
          :class="{ 'input-error': fieldErrors.email }"
          required
        />
        <div class="field-error" v-if="fieldErrors.email">
          {{ fieldErrors.email }}
        </div>
      </div>
      
      <div class="form-group">
        <label for="password">Password</label>
        <input 
          id="password"
          v-model="formData.password"
          type="password"
          placeholder="Enter your password"
          @input="clearFieldError('password')"
          :class="{ 'input-error': fieldErrors.password }"
          required
        />
        <div class="field-error" v-if="fieldErrors.password">
          {{ fieldErrors.password }}
        </div>
        <div class="password-requirements" v-if="isRegister">
          <p>Password must be at least 6 characters long</p>
        </div>
      </div>
      
      <div class="form-group" v-if="isRegister">
        <label for="characterName">Character Name</label>
        <input 
          id="characterName"
          v-model="formData.characterName"
          type="text"
          placeholder="Enter your character name"
          @input="clearFieldError('characterName')"
          :class="{ 'input-error': fieldErrors.characterName }"
          required
        />
        <div class="field-error" v-if="fieldErrors.characterName">
          {{ fieldErrors.characterName }}
        </div>
      </div>
      
      <div class="error-message" v-if="error">
        {{ error }}
      </div>
      
      <div class="form-buttons">
        <button 
          @click="submitForm"
          :disabled="isLoading"
          class="primary-button"
        >
          {{ isRegister ? 'Register' : 'Login' }}
        </button>
        
        <button 
          @click="toggleForm"
          class="secondary-button"
          :disabled="isLoading"
        >
          {{ isRegister ? 'Back to Login' : 'Create Account' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';
import axios from 'axios';

export default {
  name: 'LoginForm',
  
  emits: ['login-success'],
  
  setup(props, { emit }) {
    const isRegister = ref(false);
    const isLoading = ref(false);
    const error = ref('');
    const fieldErrors = reactive({
      username: '',
      email: '',
      password: '',
      characterName: ''
    });
    
    const formData = reactive({
      username: '',
      email: '',
      password: '',
      characterName: ''
    });
    
    const toggleForm = () => {
      isRegister.value = !isRegister.value;
      error.value = '';
      clearAllFieldErrors();
    };
    
    const clearFieldError = (field) => {
      fieldErrors[field] = '';
      if (error.value) error.value = '';
    };
    
    const clearAllFieldErrors = () => {
      for (const key in fieldErrors) {
        fieldErrors[key] = '';
      }
    };
    
    const validateForm = () => {
      let isValid = true;
      clearAllFieldErrors();
      
      // Validate username
      if (!formData.username) {
        fieldErrors.username = 'Username is required';
        isValid = false;
      }
      
      // Validate password
      if (!formData.password) {
        fieldErrors.password = 'Password is required';
        isValid = false;
      } else if (isRegister.value && formData.password.length < 6) {
        fieldErrors.password = 'Password must be at least 6 characters long';
        isValid = false;
      }
      
      // Validate email for registration
      if (isRegister.value) {
        if (!formData.email) {
          fieldErrors.email = 'Email is required';
          isValid = false;
        } else if (!validateEmail(formData.email)) {
          fieldErrors.email = 'Please enter a valid email address';
          isValid = false;
        }
        
        // Validate character name for registration
        if (!formData.characterName) {
          fieldErrors.characterName = 'Character name is required';
          isValid = false;
        }
      }
      
      return isValid;
    };
    
    const validateEmail = (email) => {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(String(email).toLowerCase());
    };
    
    const handleValidationErrors = (response) => {
      // Check if the response contains validation errors
      if (response.data && response.data.validation) {
        const validationData = response.data.validation;
        
        if (!validationData.isValid && validationData.fields) {
          for (const field in validationData.fields) {
            if (validationData.fields[field]) {
              fieldErrors[field] = validationData.fields[field];
            }
          }
        }
      }
    };
    
    const submitForm = async () => {
      error.value = '';
      
      // Validate form
      if (!validateForm()) {
        return;
      }
      
      try {
        isLoading.value = true;
        const apiUrl = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
        const endpoint = isRegister.value ? '/auth/register' : '/auth/login';
        
        const response = await axios.post(`${apiUrl}${endpoint}`, formData);
        
        if (response.data && response.data.token) {
          // Save token to localStorage for persistence
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('player', JSON.stringify(response.data.player));
          
          // Emit success event with player data
          emit('login-success', {
            player: response.data.player,
            token: response.data.token
          });
        } else {
          error.value = 'Invalid response from server';
        }
      } catch (err) {
        console.error('Authentication error:', err);
        
        // Handle validation errors from the server
        if (err.response) {
          handleValidationErrors(err.response);
          error.value = err.response.data.message || 'Authentication failed';
        } else {
          error.value = 'Unable to connect to server';
        }
      } finally {
        isLoading.value = false;
      }
    };
    
    return {
      isRegister,
      isLoading,
      error,
      fieldErrors,
      formData,
      toggleForm,
      submitForm,
      clearFieldError
    };
  }
};
</script>

<style scoped>
.login-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: #f0f0f0;
  font-family: 'Courier New', monospace;
}

.form-container {
  width: 400px;
  padding: 30px;
  background-color: #262626;
  border: 1px solid #444;
  border-radius: 5px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  color: #ffcc00;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input {
  width: 100%;
  padding: 10px;
  background-color: #333;
  color: #fff;
  border: 1px solid #555;
  border-radius: 3px;
  font-family: inherit;
}

input.input-error {
  border-color: #ff5555;
}

.field-error {
  color: #ff5555;
  font-size: 0.85rem;
  margin-top: 5px;
}

.password-requirements {
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

.error-message {
  color: #ff5555;
  margin-bottom: 20px;
  text-align: center;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
}

button {
  padding: 10px 20px;
  cursor: pointer;
  font-family: inherit;
  border-radius: 3px;
  transition: background-color 0.2s;
}

.primary-button {
  background-color: #4c6b22;
  color: #fff;
  border: 1px solid #4c6b22;
}

.primary-button:hover {
  background-color: #5d8228;
}

.secondary-button {
  background-color: transparent;
  color: #ffcc00;
  border: 1px solid #ffcc00;
}

.secondary-button:hover {
  background-color: rgba(255, 204, 0, 0.1);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style> 