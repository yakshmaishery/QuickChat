<svelte:head>
   <title>Contact Page</title>
</svelte:head>
<script lang="ts">
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   export let data;
</script>
<CommonNavBar bind:LoginID={data.LoginID}/>
<div class="container dark:text-white">
   <img src="/Images/ContactfaceIcon.png" alt="Your Avatar" class="avatar">
   <h1>Contact Me</h1>
   <p>Feel free to reach out through my GitHub or LinkedIn profiles:</p>
   <div class="contact-links">
       <a href="https://github.com/yakshmaishery" class="github" target="_blank">GitHub</a>
       <a href="https://linkedin.com/in/yakshmaishery" target="_blank">LinkedIn</a>
   </div>
   <div class="or-divider">
      <hr>
      <span>OR</span>
      <hr>
  </div>
  <div class="email-section">
      <p>Contact me via email:</p>
      <a href="mailto:maisheryyaksh@outlook.com" class="email">Maisheryyaksh@outlook.com</a>
  </div>
</div>

<style>
   .container {
       max-width: 800px;
       margin: 50px auto;
       padding: 20px;
       /* background: white; */
       border-radius: 8px;
       box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
       text-align: center;
   }
   h1 {
       color: #555;
   }
   p {
       margin: 20px 0;
   }
   .avatar {
       width: 150px;
       height: 150px;
       border-radius: 50%;
       /* border: 4px solid #0073b1; */
       margin: 20px auto;
   }
   .contact-links {
       display: flex;
       justify-content: center;
       gap: 20px;
       margin-top: 20px;
   }
   .contact-links a {
       text-decoration: none;
       color: white;
       background-color: #0073b1;
       padding: 10px 20px;
       border-radius: 5px;
       transition: background-color 0.3s ease;
   }
   .contact-links a.github {
       background-color: #333;
   }
   .contact-links a:hover {
       opacity: 0.9;
   }
   .or-divider {
       display: flex;
       align-items: center;
       justify-content: center;
       margin: 40px 0;
   }
   .or-divider hr {
       flex: 1;
       border: none;
       height: 1px;
       background: #ccc;
   }
   .or-divider span {
       margin: 0 15px;
       font-size: 1.2em;
       color: #555;
       font-weight: bold;
   }
   .email-section {
       margin-top: 20px;
       font-size: 1.2em;
       color: #555;
   }
   .email {
       font-weight: bold;
       color: #0073b1;
       text-decoration: none;
   }
   .email:hover {
       text-decoration: underline;
   }
</style>