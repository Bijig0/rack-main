import React, { useEffect, useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Link, useNavigate } from "react-router-dom";
import PrimaryButton from "../../pages/shared/components/CustomButton";
import { Dialog } from "primereact/dialog";
import SubscriptionPlanImg from "../../assets/images/icons/subscriptionplan.svg";
import ContactIcon from "../../assets/images/icons/contacticon.svg";
import LogoutIcon from "../../assets/images/icons/logouticon.svg";
import { logout } from "../../services/auth";
import { useDispatch, useSelector } from "react-redux";
import { getUserProfileAction } from "../../store/actions/userAction";
import { Avatar } from "primereact/avatar";

export default function Topbar({ onMenuToggle, onCollapse, isCollapsed }) {
  const [visible, setVisible] = useState(false);
  const [isUserPanelOpen, setIsUserPanelOpen] = useState(false);
  const op = useRef(null);
  const log = useRef(null);
  const navigate = useNavigate();
  const [isLogOut, setIsLogOut] = useState(false);
  const { profile } = useSelector((state) => state?.user);
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(
      getUserProfileAction()
    );
  }, [dispatch]);

  const notifications = [
    {
      id: 1,
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "14m ago",
      isUnread: true,
    },
    {
      id: 2,
      message: "Lorem Ipsum is simply dummy text of the printing",
      time: "15m ago",
      isUnread: true,
    },
    {
      id: 3,
      message:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
      time: "Yesterday at 5:42 PM",
      isUnread: false,
    },
  ];

const logoutHandler = () => {
    setIsLogOut(true);
    setTimeout(() => {
      logout(() => {
        navigate("/");
        setIsLogOut(false);
      });
    }, 500)
  };

  return (
    <div className="flex bg-light-color justify-content-between align-items-center p-2 px-3  sticky top-0 z-5">
      <button
        className="p-link lg:hidden flex align-items-center"
        onClick={onMenuToggle}
      >
        <i className="pi pi-bars text-2xl text-dark"></i>
      </button>
      {/* Desktop Collapse Button */}
      <button className="p-link hidden lg:block" onClick={onCollapse}>
        <i
          className={`pi ${isCollapsed ? "pi-align-right" : "pi-align-left"
            } text-xl`}
        ></i>
      </button>
      <div className="flex align-items-center gap-3">
        <div
          className="relative cursor-pointer"
          onClick={(e) => op.current.toggle(e)}
        >
          <i className="pi pi-bell text-xl text-dark cursor-pointer"></i>
          <span className="absolute top-0 right-0 w-1rem h-1rem bg-red-500 text-white border-circle flex align-items-center justify-content-center text-xs">
            2
          </span>
        </div>
        <OverlayPanel
          ref={op}
          style={{ width: "400px" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        >
          <div className="flex gap-3 justify-content-between align-items-center">
            <h3 className="text-dark font-bold">Notifications</h3>
            <Link to="">Mark all as read</Link>
          </div>
          <div className="notification-list">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item mb-3 justify-content-between flex align-items-center gap-3 ${notification.isUnread ? "unread" : ""
                  }`}
              >
                <div className="notification-content">
                  <p className="text-dark text-sm m-0">
                    {notification.message}
                  </p>
                  <span className="notification-time text-xs">
                    {notification.time}
                  </span>
                </div>
                <div className="flex gap-2 align-items-center">
                  {notification.isUnread && (
                    <div className="unread-dot border-circle"></div>
                  )}
                  <i className="pi pi-times-circle"></i>
                </div>
              </div>
            ))}
          </div>
        </OverlayPanel>
        <div className="flex align-items-center gap-3 p-2 hover:bg-white-alpha-10 border-round-lg cursor-pointer transition-colors transition-duration-150">
          <Avatar
            label={
              profile?.fullName
                ? profile.fullName.charAt(0).toUpperCase()
                : ""
            }
            size="large"
            shape="circle"
          />
          <div className="flex-1">
            <p className="m-0 font-medium text-dark">{profile?.fullName}</p>
          </div>
          <i
            className={`pi ${isUserPanelOpen ? "pi-chevron-up" : "pi-chevron-down"}`}
            onClick={(e) => {
              log.current.toggle(e);
              setIsUserPanelOpen((prev) => !prev);
            }}
          ></i>
        </div>
        <OverlayPanel ref={log} style={{ width: "200px" }}>
          <div className="">
            <ul className="list-none m-0 p-0">
              <li className="flex gap-2 text-sm py-2 cursor-pointer text-dark"><img src={SubscriptionPlanImg} alt="" /> Subscription Plans</li>
              <li className="flex gap-2 text-sm py-2 cursor-pointer text-dark"><img src={ContactIcon} alt="" /> Contact Us</li>
              <li className="flex gap-2 text-sm py-2 cursor-pointer text-dark" onClick={() => setVisible(true)}><img src={LogoutIcon} alt="" /> Logout</li>
            </ul>
          </div>
        </OverlayPanel>
      </div>
      <Dialog
        visible={visible}
        modal
        onHide={() => {
          if (!visible) return;
          setVisible(false);
        }}
        style={{ width: '450px' }} breakpoints={{ '960px': '450px', '641px': '95vw' }}
        content={({ hide }) => (
          <div className="p-5 bg-white" style={{ borderRadius: "12px" }}>
            <p className="text-lg font-semibold"
            >
              Are you sure you want to Logout?
            </p>
            <div className="flex gap-3">
              <PrimaryButton
                label="Cancel"
                className="w-full bg-light-gray"
                onClick={() => setVisible(false)}
              />
              <PrimaryButton
                label={isLogOut ? "Logging out.." : "Logout"}
                className="border-none w-full"
                onClick={logoutHandler}
                loading={isLogOut}
              />
            </div>
          </div>
        )}
      ></Dialog>
    </div>
  );
}
