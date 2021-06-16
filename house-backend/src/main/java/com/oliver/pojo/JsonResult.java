package com.oliver.pojo;

import java.io.Serializable;

public class JsonResult<T> implements Serializable {
    private T data;
    private String code;
    private String msg;

    public JsonResult() {
        this.code="0";
        this.msg="success!";
    }

    public JsonResult(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public JsonResult(T data) {
        this.data = data;
    }

    public JsonResult(T data, String code, String msg) {
        this.data = data;
        this.code = code;
        this.msg = msg;
    }
}
