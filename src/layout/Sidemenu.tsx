import {
  DoubleLeftOutlined,
  DoubleRightOutlined,
  EllipsisOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from "@ant-design/icons";
import { Button, Popover } from "antd";
import Loading from "common/components/loading";
import { useAppSelector } from "globalRedux/hooks";
import { setDataAction } from "globalRedux/localStorage/actions";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Dispatch } from "redux";
import mgmLogo from "../assets/images/mgm-logo.svg";
import {
  isNoNeedMenu,
  MenuList,
  renderPlusIcon,
  setDefaultMenu
} from "./utils";

const Sidemenu = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const responsiveInfo = useAppSelector(
    (state) => state?.localStorage?.responsiveInfo || {}
  );

  const { childMenus, title, subTitle, isShow, parentMenus } = useAppSelector(
    (state) => state?.localStorage?.menus || {}
  );

  const dispatch: Dispatch<any> = useDispatch();
  useEffect(() => {
    if (parentMenus?.length > 0) {
      setDefaultMenu(
        dispatch,
        childMenus,
        title,
        subTitle,
        isShow,
        parentMenus
      );
    }
  }, [parentMenus]);

  useEffect(() => {
    dispatch(setDataAction("menus", "parentMenus", MenuList));
  }, []);

  const toggleCollapsed = () => {
    dispatch(
      setDataAction("responsiveInfo", "collapsed", !responsiveInfo.collapsed)
    );
  };
  useEffect(() => {
    const handleResize = () => {
      dispatch(
        setDataAction(
          "responsiveInfo",
          "collapsed",
          responsiveInfo.collapsed || false
        )
      );
      if (window.innerWidth <= 768) {
        dispatch(setDataAction("responsiveInfo", "isMobileScreen", true));
      } else {
        dispatch(setDataAction("responsiveInfo", "isMobileScreen", false));
      }
    };
    // Initial check
    handleResize();
    window.addEventListener("resize", handleResize);
    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {responsiveInfo?.isMobileScreen && (
        <div className="isMobileDeviceCollapsedBtn" onClick={toggleCollapsed}>
          <Button
            type="primary"
            style={{ color: "#fff", background: "#0a8080" }}
            onClick={toggleCollapsed}
          >
            {responsiveInfo?.collapsed ? (
              <MenuUnfoldOutlined />
            ) : (
              <MenuFoldOutlined />
            )}
          </Button>
        </div>
      )}
      <div
        style={{
          display:
            responsiveInfo?.isMobileScreen && !responsiveInfo?.collapsed
              ? "none"
              : "block"
        }}
      >
        <div
          className={`sidebar-tk-menu-first-section `}
          style={{
            paddingTop:
              responsiveInfo?.isMobileScreen && responsiveInfo?.collapsed
                ? "30px"
                : "0px"
          }}
        >
          <div>
            <img className="sidebar-tk-menu-logo" src={mgmLogo} alt="logo" />
            {parentMenus?.length > 0 &&
              parentMenus.map((item: any, index: number) => (
                <div
                  key={index}
                  className="sidebar-tk-menu-item"
                  onClick={() => {}}
                >
                  <Popover
                    overlayClassName="sidebar-tooltip"
                    placement="rightTop"
                    content={
                      <>
                        {item?.secondLabelMenuList?.map(
                          (nestedItem: any, index: number) => (
                            <Link
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(
                                  setDataAction(
                                    "menus",
                                    "childMenus",
                                    item.secondLabelMenuList
                                  )
                                );
                                dispatch(
                                  setDataAction("menus", "title", item.label)
                                );
                                dispatch(
                                  setDataAction(
                                    "menus",
                                    "subTitle",
                                    nestedItem?.strLabel
                                  )
                                );
                                dispatch(
                                  setDataAction(
                                    "responsiveInfo",
                                    "collapsed",
                                    false
                                  )
                                );
                              }}
                              to={nestedItem?.strTo}
                              className={
                                nestedItem?.strLabel === subTitle
                                  ? "nav-link active"
                                  : "nav-link"
                              }
                            >
                              {nestedItem?.strLabel}
                            </Link>
                          )
                        )}
                      </>
                    }
                    title={item?.label}
                  >
                    <div
                      className={
                        title === item?.label
                          ? "sidebar-tk-menu-icon active"
                          : "sidebar-tk-menu-icon"
                      }
                    >
                      <HomeOutlined className="icon" />
                    </div>
                    <div className="first-label-text">{item?.label}</div>
                  </Popover>
                </div>
              ))}
            <div className="mid-ball">
              <EllipsisOutlined className="icon" />
            </div>
          </div>
          <span
            onClick={() => {
              dispatch(setDataAction("menus", "isShow", !isShow));
            }}
            className="collapse-icon"
          >
            {isShow ? (
              <DoubleLeftOutlined className="icon" />
            ) : (
              <DoubleRightOutlined className="icon" />
            )}
          </span>
        </div>
        <div
          className={
            isShow
              ? "sidebar-tk-menu-second-section"
              : "sidebar-tk-menu-second-section sidebar-tk-menu-collapse"
          }
        >
          <div className="second-section-title">
            <p>MANAGERIUM</p>
            <p style={{ textAlign: "center", paddingRight: "8px" }}>LITE</p>
          </div>
          {childMenus?.map((item: any, index: number) => (
            <Link
              key={index}
              className={
                item?.strLabel === subTitle ? "nav-link active" : "nav-link"
              }
              to={item?.strTo}
              onClick={() => {
                dispatch(setDataAction("responsiveInfo", "collapsed", false));
                dispatch(setDataAction("menus", "subTitle", item?.strLabel));
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>{item?.strLabel}</span>
                {/* {renderPlusIcon(item, navigate, open, setOpen, dispatch)} */}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Sidemenu;
