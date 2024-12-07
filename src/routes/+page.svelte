<svelte:head>
   <title>Home Page</title>
</svelte:head>
<script lang="ts">
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   import '$lib/Styles/HomePage.css'
   export let data;
</script>
<div class="maincontainer">
   <div>
      <CommonNavBar bind:LoginID = {data.LoginID}/>
   </div>
   <div class="welcome-container dark:text-white">
      <div class="welcome-middiv">
         <div class="welcome-card">
             <h1>Welcome to Quick chat!</h1>
             <p>Your gateway to seamless and engaging conversations.</p>
             <a href="/LoginPage">Get Started</a>
         </div>
      </div>
  </div>
</div>