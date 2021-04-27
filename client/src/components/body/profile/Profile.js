import { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { isLength, isMatch } from "../../utils/validation/Validation";
import { showSuccessMsg, showErrMsg } from "../../utils/notification/Notification";

const initialState = {
  name: "",
  password: "",
  cf_password: "",
  phone: "",
  address: "",
  dob: "",
  err: "",
  success: "",
};

const Profile = () => {
  const auth = useSelector((state) => state.auth);
  const token = useSelector((state) => state.token);
  const { user } = auth;
  const [data, setData] = useState(initialState);
  const {
    name,
    password,
    cf_password,
    phone,
    address,
    dob,
    err,
    success,
  } = data;
  const [avatar, setAvatar] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value, err: "", success: "" });
  };

  const changeAvatar = async (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];

      if (!file)
        return setData({
          ...data,
          err: "No files were uploaded.",
          success: "",
        });

      if (file.size > 1024 * 1024)
        return setData({ ...data, err: "Size too large.", success: "" });

      if (file.type !== "image/jpeg" && file.type !== "image/png")
        return setData({
          ...data,
          err: "File format is incorrect.",
          success: "",
        });

      let formData = new FormData();
      formData.append("file", file);

      setLoading(true);
      const res = await axios.post("/api/upload_avatar", formData, {
        headers: {
          "content-type": "multipart/form-data",
          Authorization: token,
        },
      });

      setLoading(false);
      setAvatar(res.data.url);
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updateInfor = () => {
    try {
      axios.patch(
        "/user/update",
        {
          name: name ? name : user.name,
          phone: phone ? phone : user.phone,
          address: address ? address : user.address,
          dob: dob ? dob : user.dob,

          avatar: avatar ? avatar : user.avatar,
        },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const updatePassword = () => {
    if (isLength(password))
      return setData({
        ...data,
        err: "Password must be at least 6 characters.",
        success: "",
      });

    if (!isMatch(password, cf_password))
      return setData({ ...data, err: "Password did not match.", success: "" });

    try {
      axios.post(
        "/user/reset",
        { password },
        {
          headers: { Authorization: token },
        }
      );

      setData({ ...data, err: "", success: "Updated Success!" });
    } catch (err) {
      setData({ ...data, err: err.response.data.msg, success: "" });
    }
  };

  const handleUpdate = () => {
    if (name || avatar || phone || address || dob) updateInfor();
    if (password) updatePassword();
  };

  if (user?.dob) {
    var user_dob = user.dob.slice(0, 10);
  }

  return (
    <>
      <div>
        {err && showErrMsg(err)}
        {success && showSuccessMsg(success)}
        {loading && <h3>Loading.....</h3>}
      </div>
      <div className="profile_page">
        <div className="col-left">
          <h2>User Profile</h2>

          <div className="avatar">
            <img src={avatar ? avatar : user.avatar} alt="" />
            <span>
              <i className="fas fa-camera"></i>
              <p>Change</p>
              <input
                type="file"
                name="file"
                id="file_up"
                onChange={changeAvatar}
              />
            </span>
          </div>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              defaultValue={user.name}
              placeholder="Your name"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              defaultValue={user.email}
              placeholder="Your email address"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              maxLength="10"
              defaultValue={user.phone}
              placeholder="Your Phone Number"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <input
              type="text"
              name="address"
              id="address"
              defaultValue={user.address}
              placeholder="Your Address"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="dob">Date of Birth</label>
            <input
              type="Date"
              name="dob"
              id="dob"
              defaultValue={user_dob}
              placeholder="Your Date of Birth"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Your password"
              value={password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="cf_password">Confirm New Password</label>
            <input
              type="password"
              name="cf_password"
              id="cf_password"
              placeholder="Confirm password"
              value={cf_password}
              onChange={handleChange}
            />
          </div>

          <button disabled={loading} onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;
