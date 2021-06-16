package com.oliver;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.oliver.dao")
@SpringBootApplication
public class HouseBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(HouseBackendApplication.class, args);
    }

}
