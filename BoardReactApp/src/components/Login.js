import React, { useRef, useState } from "react";

export default function TodoLogin(props) {
  const idRef = useRef();
  const [id, setId] = useState("");
  const pwRef = useRef();
  const [pw, setPw] = useState("");

  const reset = () => {
    idRef.current.value = "";
    pwRef.current.value = "";
    setId("");
    setPw("");
  };
  
  return (
    <div>
        <div>
      <input
        ref={idRef}
        type="text"
        placeholder="아이디 입력"
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
    </div>
    <div>
    <input
      ref={pwRef}
      type="password"
      placeholder="비밀번호 입력"
      onChange={(e) => {
        setPw(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          if (id.length > 0 && pw.length > 0) {
            props.login(id, pw)
            .catch((error) => {
              reset();
            });
          }
          else {
            reset();
          }
        }
      }}
    />
    <button
        onClick={(e) => {
            if (id.length > 0 && pw.length > 0) {
              props.login(id, pw)
              .catch((error) => {
                reset();
              });
            }
            else {
              reset();
            }
        }}
    >
      로그인
    </button>
  </div>
  <hr />
    </div>
  );
}