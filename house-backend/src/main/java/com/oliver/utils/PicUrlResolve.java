package com.oliver.utils;

import org.junit.Test;

import java.util.ArrayList;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class PicUrlResolve {

    /**
     * 解析房源缩略图
     * @param text
     * @return
     */
    public static String extractCoverImage(String text){
        String pattern="h(.*?)=1";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(text);
        if (matcher.find()){
            return matcher.group(0);
        }
        return null;
    }
    @Test
    /**
     * 解析房源图片列表
     */
    public static ArrayList<String> extractImageList(String text){
        ArrayList<String> imageList = new ArrayList<>();
        String pattern="h(.*?)=1";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(text);
        while (matcher.find()){
            imageList.add(matcher.group());
        }
        return imageList;
    }
}
/**
 * ['https://pic1.ajkimg.com/display/anjuke/e76c56abeb598768fda305a2f08febe8/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/9951eb41bfa049a19d1f60e70fddfc67/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/99eaaf7236a684648bd7ac3f1ae2cda1/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/7d778db0d62ef047bb1d8410e854b69f/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/c95f2c5be602940dc06849c69b8befe9/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/d1ca02cb7d05e83aa0e3089a80cdad1c/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/eda27b1c7f6bdd367f7f314b34c947e3/600x450c.jpg?t=1&srotate=1',
 * 'https://pic1.ajkimg.com/display/anjuke/f0de30ffe45f0bd071f90ca6264ef591/600x450c.jpg?t=1&srotate=1']
 */
