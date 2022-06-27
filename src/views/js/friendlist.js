/* eslint-disable no-shadow */
const friendList = document.getElementById('friend-list');
const searchUsers = document.getElementById('search-box');
const modal = document.querySelector('.modal');
function toggleModal() {
  modal.classList.toggle('show-modal');
}
searchUsers.addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    const search = searchUsers.value;
    event.preventDefault();
    await fetch(`http://127.0.0.1:5000/api/v2/auth/getUsers?search=${search}`)
      .then((data) => data.json())
      .then((datafound) => {
        let html = '';
        const otherUserList = document.getElementById('other-users');
        if (datafound.data.length !== 0) {
          datafound.data.forEach((element) => {
            html += `<div class="_2wP_Y" style="z-index: 35; height: 72px; transform: translateY(0px); transition: none 0s ease 0s;">
            <div tabindex="-1">
                <div class="_2EXPL">
                    <div class="dIyEr">
                        <div class="_1WliW" style="height: 49px; width: 49px;"><img
                                src="https://dyn.web.whatsapp.com/pp?e=https%3A%2F%2Fpps.whatsapp.net%2Fv%2Ft61.11540-24%2F36213239_205252013662177_8403903246124449792_n.jpg%3Foe%3D5BEAD3AB%26oh%3D3d7fa4a8514814bf245a4d423a7fb781&amp;t=s&amp;u=923311442244%40c.us&amp;i=1531644501"
                                class="Qgzj8 gqwaM" style="visibility: visible;">
                            <div class="_3ZW2E"><span data-icon="default-user" class=""><svg xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 212 212" width="212" height="212">
                                        <path fill="#DFE5E7"
                                            d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z">
                                        </path>
                                        <g fill="#FFF">
                                            <path
                                                d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z">
                                            </path>
                                        </g>
                                    </svg></span></div>
                        </div>
                    </div>
                    <div class="_3j7s9">
                        <div class="_2FBdJ">
                            <div class="_25Ooe"><span class="_3TEwt"><span dir="auto" title="${element.email}"
                                        class="_1wjpf">${element.firstName} ${element.lastName}
                                    </span>
                                    <div class="_1yct0"></div>
                                </span></div>
                            <div class="_3Bxar"><span class="_3T2VG">7:43 PM</span>
                            </div>
                        </div>
                        <div class="_1AwDx">
                            <div class="_itDl"><span class="_2_LEW" title="&#8234;${element.email}&#8236;">
                                    <div class="_1VfKB">
                                        <span dir="ltr" class="_1wjpf _3NFp9">${element.email}</span>
                                    </div>
                                    <input type="button" id='${element._id}' class="request" value="Add Friend"
                                        onclick="addFriend(this)">
                                </span></div>
                            <div class="_3Bxar"><span></span><span></span><span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>        
      `;
          });
          otherUserList.innerHTML = html;
        } else {
          otherUserList.innerHTML = '<h5> Users Not Found </h5>';
        }

        toggleModal();
      });
    const closeButton = document.querySelector('.close-button');
    closeButton.addEventListener('click', toggleModal);
  }
});

function addFriend(e) {
  fetch(`http://127.0.0.1:5000/api/v2/communication/sendRequest/${e.id}`)
    .then((data) => data.json())
    .then((datafound) => {
      if (datafound.statusCode === 200) {
        e.value = 'Request Sent';
        e.style.background = 'linear-gradient(90deg, #dc5252, #ffb8c5)';
      }
      if (datafound.statusCode === 400) {
        e.value = 'Add Friend';
        e.style.background = 'linear-gradient(90deg, #1864bb, #55e7fc)';
      }
    });
}