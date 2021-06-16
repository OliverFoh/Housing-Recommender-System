package com.oliver.utils;

import org.apache.log4j.helpers.DateTimeDateFormat;
import org.junit.Test;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

public class GenerateTime {
    @Test
    public static String now(){
        Date date = new Date();
        SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        //System.out.println(sdf.format(date));
        return sdf.format(date);
    }
}
