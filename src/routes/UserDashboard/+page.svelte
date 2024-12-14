<svelte:head>
   <title>User Dashboard</title>
</svelte:head>
<script lang="ts">
   import { io } from "socket.io-client";
   import { enhance } from "$app/forms";
   import CommonNavBar from "$lib/Mycomponents/CommonNavBar.svelte";
   import '$lib/Styles/UserDashboard.css'
   import { Textarea, Toolbar, Heading, Drawer, Button, CloseButton, Input,Hr,SidebarCta } from 'flowbite-svelte';
   import { BarsOutline,ClipboardSolid,CaretRightSolid } from 'flowbite-svelte-icons';
   import { sineIn } from 'svelte/easing';
   import { onMount } from "svelte";
   import Swal from "sweetalert2";

   export let data
   let hidden1 = true;
   let transitionParams = {
      x: 320,
      duration: 200,
      easing: sineIn
   };
   let currentGroupID = ""
   let socket: any;
   let message = '';
   let messages:any = [];
   let joinGroupID = ""
   let CurrentLoginID = data.LoginID

   onMount(() => {
       socket = io('https://chatappserver-1yf9.onrender.com',{query:{CurrentLoginID:CurrentLoginID}}); // Replace with your server's URL
         // socket = io('http://localhost:3000',{query:{CurrentLoginID:CurrentLoginID}}); // Replace with your server's URL

        socket.on('connect', () => {
            console.log('Connected to the server');
        });

        // Listen for events in the room
         socket.on('joinRoomMessage', (data:any) => {
            debugger
            currentGroupID = data.key
            Swal.fire({title:"New Join",text:data.msg,confirmButtonColor:"green"})
         });

         socket.on("UserLoggedIN",(data:string)=>{
            // alert(data)
            if(data == CurrentLoginID){
               handleSubmit()
            }
         })

         // Listen for incoming messages
         socket.on('message', (data:any) => {
            let Data = {CurrentLoginID:data.CurrentLoginID,message:data.message,datetime:new Date().toISOString()}
            messages = [...messages,Data]
            setTimeout(() => {
               const div = document.getElementById("scrollableDiv");
               if(div){
                  div.scrollTo({
                     top: div.scrollHeight+2000,
                     behavior: "smooth"
                  });
               }
            }, 500);
         });
         // Listen for incoming messages
         socket.on('leaveRoomMessage', (data:any) => {
            joinGroupID = ""
            currentGroupID = ""
            Swal.fire({title:"Left room",text:data.message,confirmButtonColor:"green"})
         });
         // Listen for incoming messages
         socket.on('leaveRoomMessageToAll', (data:any) => {
            Swal.fire({title:"Left room",text:data.message,confirmButtonColor:"green"})
         });

        return () => {
            socket.disconnect();
        };
    });

    const joinByCode = () => {
      // Request to join the generated room
      socket.emit('joinRoom', {joinGroupID,CurrentLoginID});
    }

    const SendMessges = () => {
      socket.emit('sendMessage', { CurrentLoginID,currentGroupID, message });
      message = ""
    }

    const CreateNewGroup = () => {
      const randomKey = Math.random().toString(36).substring(2, 15);
      joinGroupID = randomKey
      socket.emit('joinRoom', {joinGroupID,CurrentLoginID});
    }

    const LeaveRoom = () => {
      socket.emit('leaveRoom', { CurrentLoginID,currentGroupID });
    }

    const CopyMessage = (msg:string) => {
      navigator.clipboard.writeText(msg);
    }
    async function handleSubmit() {
        const formData = new FormData();
      //   formData.append('name', name);

        // Call the action using fetch
        const res = await fetch('/UserDashboard?/LogoutActionMethos', {
            method: 'POST',
            body: formData
        });

        if (res.ok) {
            window.location.href="/"
            // responseMessage = result.message || 'Form submitted successfully!';
        } else {
            // responseMessage = 'Failed to submit form.';
        }
    }
</script>
<div class="Maindash">
   <div>
      <CommonNavBar bind:LoginID = {data.LoginID}/>
   </div>
   <div style="overflow-y: auto;" id="scrollableDiv">
      <div class="chat-box">
         {#each messages as ele}
            <div class={`message ${ele.CurrentLoginID == data.LoginID?"sent":"received"}`}>
                <div class="message-info">
                    <span class="message-ID">
                        {ele.CurrentLoginID}
                        <Button on:click={()=>{CopyMessage(ele.message)}} class="clipboardbtn"><ClipboardSolid/></Button>
                     </span>
                    <span class="timestamp">{ele.datetime}</span>
                </div>
                <div class="message-content"><pre class="dynamicMessage">{ele.message}</pre></div>
            </div>
         {/each}
      </div>
   </div>
   <div>
      <form>
         <Textarea class="" placeholder="Write a message" bind:value={message} disabled={currentGroupID != ""?false:true}>
           <div slot="footer" class="flex items-center justify-between">
            <div style="display: flex;gap:15px">
               <Button type="submit" disabled={currentGroupID != ""?false:true} on:click={SendMessges}>Send <CaretRightSolid/></Button>
            </div>
            <Toolbar embedded>
               <Button type="button" on:click={() => (hidden1 = false)}><BarsOutline/></Button>
               <!-- <ToolbarButton name="Attach file"><PaperClipOutline class="w-6 h-6" /></ToolbarButton> -->
               <!-- <ToolbarButton name="Set location"><MapPinAltSolid class="w-6 h-6" /></ToolbarButton> -->
               <!-- <ToolbarButton name="Upload image"><ImageOutline class="w-6 h-6" /></ToolbarButton> -->
             </Toolbar>
           </div>
         </Textarea>
       </form>
   </div>
</div>

<Drawer placement="right" transitionType="fly" transitionParams={transitionParams} bind:hidden={hidden1} id="sidebar6">
   <div class="flex items-center">
      <h5 id="drawer-navigation-label-3" class="text-base font-semibold text-gray-500 uppercase dark:text-gray-400">Menu</h5>
      <CloseButton on:click={() => (hidden1 = true)} class="mb-4 dark:text-white" />
    </div>
    <div>
      <Heading tag="h4">Welcome</Heading>
      <Heading tag="h5">{data.LoginID}</Heading>
      <br/>
      <hr/>
      <br/>
      <Button disabled={currentGroupID == ""?false:true} on:click={CreateNewGroup}>Create Group</Button>
      <Hr classHr="my-8 w-64">or</Hr>
      <form>
         <!-- <Label for="search" class="block mb-2">Your Email</Label> -->
         <Input id="search" placeholder="Enter Group ID" bind:value={joinGroupID} size="lg" disabled={currentGroupID == ""?false:true}>
           <!-- <SearchOutline slot="left" class="w-6 h-6 text-gray-500 dark:text-gray-400" /> -->
           <Button slot="right" size="sm" type="submit" disabled={currentGroupID == ""?false:true} on:click={joinByCode}>Join</Button>
         </Input>
      </form>
      <br/>
      <Button disabled={currentGroupID != ""?false:true} class="my-2" on:click={LeaveRoom}>Leave Group - {currentGroupID}</Button>
      <br/>
      <form method="post" use:enhance>
         <Button disabled={currentGroupID == ""?false:true} type="submit" class="my-2" formaction="/UserDashboard?/LogoutActionMethos" formmethod="POST">Logout</Button>
      </form>
      <SidebarCta label="Note">
         <p class="mb-3 text-sm text-primary-900 dark:text-primary-400">The app is currently in its Beta version, so it may become inactive if left unused for more than 15 minutes.</p>
       </SidebarCta>
    </div>
</Drawer>