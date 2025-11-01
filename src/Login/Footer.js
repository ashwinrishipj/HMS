import React from "react";

export default function Footer() {
  return (
    <div className="row mt-4" id="contact">
      <div
        className="col-sm-12 col-md-4"
      >
        <h3 className="text-warning"> Ashwin Rishi </h3>
        <ul className="footerMyProfile text-light">
          <li>A full stack developer</li>
          <li>Ex-Cerner Employee</li>
          <li>VIT Graduate</li>
          <li>
            <i className="fa fa-smile-o" style={{ fontSize: "25px" }}></i>
          </li>
        </ul>
      </div>
      <div
        className="col-sm-12 col-md-4"

      >
        <h3 className="text-warning">Get in Touch.</h3>
        <ul className="social-nav-footer text-light" style={{ listStyle: "none" }}>
          <li>
            <a href="mailto:pjashwinrishi@gmail.com" target={"_blank"} rel="noreferrer noopener">
              <i className="fa fa-envelope text-white" aria-hidden="true"> <span className="ml-2">Email</span></i>
            </a>
          </li>

          <li>
            <a href="https://github.com/ashwinrishipj" target={"_blank"} rel="noreferrer noopener">
              <i className="fa fa-github text-light" aria-hidden="true"><span className="ml-2">Github</span></i>
            </a>
          </li>

          <li>
            <a
              href="https://www.linkedin.com/in/ashwinrishipj/"
              target={"_blank"}
              rel="noreferrer noopener"
            >
              <i className="fa fa-linkedin text-light" aria-hidden="true">
                <span className="ml-2">linkedin </span>
              </i>
            </a>
          </li>

          <li>
            <a href="https://twitter.com/ashwinrishipj" target={"_blank"} rel="noreferrer noopener">
              <i className="fa fa-twitter text-light" aria-hidden="true">
                <span className="ml-2">Twitter</span>
              </i>
            </a>
          </li>
        </ul>
      </div>

      <div
        className="col-sm-12 col-md-4 "
        
      >
        <h3 className="text-warning" >My bloggings:</h3>

        <div
          className="alert alert-outline-success card bg-transparent text-white border-white pointer-css"
          style={{width:"23rem"}}
        >
          <a href="https://medium.com/@ashwinrishipj/javascript-the-fuzz-about-hoisting-variable-shadowing-and-closure-b8937bae349e" target={"_blank"} rel="noreferrer noopener">
            JavaScript — the fuzz about hoisting,variable shadowing and
            closure.
                <i
            className="fa fa-arrow-right"
            ></i>
          </a>
        </div>
        <div
          className="alert alert-outline-danger card  bg-transparent text-white border-white pointer-css"
         
          style={{width:"23rem"}}
        >
          <a href="https://medium.com/@ashwinrishipj/html-and-css-the-fun-language-of-all-b4214db90fad" target={"_blank"} rel="noreferrer noopener">
            Html and css: the fun language of all.
                <i className="fa fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
};
