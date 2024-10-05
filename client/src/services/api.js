import { getApiUrl } from "../utils/getApiUrl";
const apiUrl = getApiUrl();

export const verifyRecaptcha = (token) => {
  return fetch(`${apiUrl}/common/verify-recaptcha`, {
    method: "POST",
    body: JSON.stringify({ token }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const createNewAccount = (body) => {
  return fetch(`${apiUrl}/users/create-new`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const login = (body) => {
  return fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const getUserSession = (id) => {
  return fetch(`${apiUrl}/users/get-by-id/${id}`, {})
    .then((res) => res)
    .then((res) => res.json())
    .catch((err) => {
      console.log("err", err);
    });
};

export const createNewRentHouse = (body) => {
  return fetch(`${apiUrl}/rent-house/create-new`, {
    method: "POST",
    body: body,
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const getAllHouses = (id) => {
  return fetch(`${apiUrl}/rent-house/get-all`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getHousesByOwnerId = (id) => {
  return fetch(`${apiUrl}/rent-house/get-by-owner-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getHousesBySubcity = (subcity) => {
  return fetch(`${apiUrl}/rent-house/get-by-subcity/${subcity}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getHouseById = (id) => {
  return fetch(`${apiUrl}/rent-house/get-by-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const deleteRentHouseMedia = (id, fileName) => {
  return fetch(`${apiUrl}/rent-house/delete-media/${id}`, {
    method: "POST",
    body: JSON.stringify({ fileName }),
    headers: { "Content-Type": "application/json" },
  }).then((res) => res);
};

export const updateHouseById = (id, data) => {
  return fetch(`${apiUrl}/rent-house/update/${id}`, {
    method: "PUT",
    body: data,
  }).then((res) => res);
};

export const deleteHouseById = (id) => {
  return fetch(`${apiUrl}/rent-house/delete/${id}`, {
    method: "DELETE",
  }).then((res) => res);
};

///////////////////

export const createNewChatInstance = (body) => {
  return fetch(`${apiUrl}/chat-instance/create-new`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const getAllChatInstances = (id) => {
  return fetch(`${apiUrl}/chat-instance/get-all`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getChatInstanceByUserId = (id) => {
  return fetch(`${apiUrl}/chat-instance/get-by-user-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getChatInstanceByUsersAndHouseId = (id1, id2, houseId) => {
  return fetch(
    `${apiUrl}/chat-instance/get-by-users-and-house-id/${id1}/${id2}/${houseId}`
  )
    .then((res) => res)
    .then((res) => res.json());
};

export const getChatInstanceById = (id) => {
  return fetch(`${apiUrl}/chat-instance/get-by-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const updateChatInstanceById = (id, data) => {
  return fetch(`${apiUrl}/chat-instance/update/${id}`, {
    method: "PUT",
    body: data,
  }).then((res) => res);
};

export const deleteChatInstanceById = (id) => {
  return fetch(`${apiUrl}/chat-instance/delete/${id}`, {
    method: "DELETE",
  }).then((res) => res);
};

//

export const createNewChatMessage = (body) => {
  return fetch(`${apiUrl}/chat-message/create-new`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const sendFilesAsMessage = (body) => {
  return fetch(`${apiUrl}/chat-message/send-files`, {
    method: "POST",
    body,
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const getAllChatMessages = (id) => {
  return fetch(`${apiUrl}/chat-message/get-all`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getChatMessageByInstanceId = (id) => {
  return fetch(`${apiUrl}/chat-message/get-by-instance-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getChatMessageById = (id) => {
  return fetch(`${apiUrl}/chat-message/get-by-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const updateChatMessageById = (id, data) => {
  return fetch(`${apiUrl}/chat-message/update/${id}`, {
    method: "PUT",
    body: data,
  }).then((res) => res);
};

export const deleteChatMessageById = (id) => {
  return fetch(`${apiUrl}/chat-message/delete/${id}`, {
    method: "DELETE",
  }).then((res) => res);
};

//

export const getSavedHouseByUserId = (id) => {
  return fetch(`${apiUrl}/saved-house/get-by-user-id/${id}`)
    .then((res) => res)
    .then((res) => res.json());
};

export const getSavedHouseByUserAndHouseId = (userId, houseId) => {
  return fetch(
    `${apiUrl}/saved-house/get-by-user-and-house-id/${userId}/${houseId}`
  )
    .then((res) => res)
    .then((res) => res.json());
};

export const saveNewHouse = (body) => {
  return fetch(`${apiUrl}/saved-house/create-new`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res)
    .then((res) => res.json());
};

export const removeSavedHouseById = (id) => {
  return fetch(`${apiUrl}/saved-house/delete/${id}`, {
    method: "DELETE",
  }).then((res) => res);
};
