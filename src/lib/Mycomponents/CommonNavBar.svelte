<script>
   import { Navbar, NavBrand, NavLi, NavUl, NavHamburger,DarkMode } from 'flowbite-svelte';
   import { page } from '$app/stores';
   $: activeUrl = $page.url.pathname;
   export let LoginID = ""
 </script>
<Navbar>
   <NavBrand href="/">
     <img src="/Images/APPICON.png" class="me-3 h-6 sm:h-9" alt="Flowbite Logo" />
     <span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Quick Chat</span>
   </NavBrand>
   <NavHamburger  />
   <NavUl {activeUrl}>
     <NavLi href="/">Home</NavLi>
     <NavLi href="/About">About</NavLi>
     <NavLi href="/Contact">Contact</NavLi>
     <NavLi><DarkMode style="padding:0px"/></NavLi>
     {#if LoginID}
      <NavLi href="/UserDashboard">{LoginID}</NavLi>
     {/if}
   </NavUl>
 </Navbar>