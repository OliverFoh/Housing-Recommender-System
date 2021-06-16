package com.oliver.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.algorithms.Algorithm;
import com.sun.org.apache.xml.internal.security.algorithms.SignatureAlgorithm;

/**
 * token生成类
 */
public class JavaWebToken {
    public static String createJWT(String id,String password){
        String token = JWT.create().withAudience(id).sign(Algorithm.HMAC256(password));
        return token;
    }

}
