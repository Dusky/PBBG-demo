<template>
  <div class="app">
    <div v-if="isAuthenticated">
      <GameInterface 
        :player="player" 
        :token="token" 
        @logout="handleLogout"
      />
    </div>
    <div v-else>
      <LoginForm @login-success="handleLoginSuccess" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import GameInterface from './components/GameInterface.vue';
import LoginForm from './components/LoginForm.vue';

export default {
  name: 'App',
  
  components: {
    GameInterface,
    LoginForm
  },
  
  setup() {
    const isAuthenticated = ref(false);
    const player = ref(null);
    const token = ref('');
    
    // Check if user is already logged in
    onMounted(() => {
      const savedToken = localStorage.getItem('token');
      const savedPlayer = localStorage.getItem('player');
      
      if (savedToken && savedPlayer) {
        try {
          token.value = savedToken;
          player.value = JSON.parse(savedPlayer);
          isAuthenticated.value = true;
        } catch (error) {
          console.error('Error parsing saved player data:', error);
          // Clear invalid data
          localStorage.removeItem('token');
          localStorage.removeItem('player');
        }
      }
    });
    
    // Handle successful login
    const handleLoginSuccess = (data) => {
      player.value = data.player;
      token.value = data.token;
      isAuthenticated.value = true;
    };
    
    // Handle logout
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('player');
      isAuthenticated.value = false;
      player.value = null;
      token.value = '';
    };
    
    return {
      isAuthenticated,
      player,
      token,
      handleLoginSuccess,
      handleLogout
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Courier New', monospace;
  background-color: #1a1a1a;
  color: #f0f0f0;
}

.app {
  min-height: 100vh;
}
</style> 