---
title: MAVEN打包时自动给静态文件添加时间戳
date: 2022-04-18 10:56:43
tags:
  - Maven
---

每次 maven 打包更新时，静态文件的路径不会变，如果用户不清缓存的话，就存在更新不及时的问题.所以需要在打包时自动添加时间戳，以实现用户无需清缓存就能使用到最新版本的目标。

<!--more-->

## 一、添加时间戳

### （一）思路

因为不是前后端分离用 webpack 打包，直接修改文件名不是非常现实，那么请求时加参数的方法算是一个比较简单的解决方案。

我的需求中需要完成几件事：

1. 将 html 文件中的 js 和 css 引用都添加时间戳参数
2. 将 ftl 文件（FreeMarker）中的 js 和 css 引用都添加时间戳参数。如果用的是其他的模版语言，也可以类似参考
3. 将 requirejs 的请求统一添加时间戳参数

### （二）依赖

这边要用到 Google 的一个 replacer 插件，可以在最终打包前替换文件内容。原名为 `maven-replacer-plugin`，2012 年后改名为 `replacer`。到现在为止最新版本为 2014 年 4 月 16 日发布的 `1.5.3` 版本。

如果没有指定 `basedir`，则后面的文件路径都要写绝对路径。可以通过 `includes` 和 `excludes` 指定包含和排除的文件，也可以通过 `file` 来指定特定文件。

### （三）pom.xml 参考

```xml
<project>
    <properties>
        <maven.build.timestamp.format>yyyyMMddHHmmss</maven.build.timestamp.format>
    </properties>
    <dependencies>
        <!--...-->
        <dependency>
            <groupId>com.google.code.maven-replacer-plugin</groupId>
            <artifactId>replacer</artifactId>
            <version>1.5.3</version>
        </dependency>
        <!--...-->
    </dependencies>
    <build>
        <plugins>
            <!--...-->
            <plugin>
                <groupId>com.google.code.maven-replacer-plugin</groupId>
                <artifactId>replacer</artifactId>
                <version>1.5.3</version>
                <executions>
                    <execution>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>replace</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <!--定位到target文件夹-->
                    <basedir>${project.build.directory}</basedir>
                    <includes>
                        <!--匹配ftl和html文件-->
                        <include>*.ftl</include>
                        <include>**/*.ftl</include>
                        <include>*.html</include>
                        <include>**/*.html</include>
                    </includes>
                    <replacements>
                        <!--分别匹配单引号和双引号版本-->
                        <replacement>
                            <token>\.css\"</token>
                            <value>.css?v=${maven.build.timestamp}\"</value>
                        </replacement>
                        <replacement>
                            <token>\.css\'</token>
                            <value>.css?v=${maven.build.timestamp}\'</value>
                        </replacement>
                        <replacement>
                            <token>\.js\"</token>
                            <value>.js?v=${maven.build.timestamp}\"</value>
                        </replacement>
                        <replacement>
                            <token>\.js\'</token>
                            <value>.js?v=${maven.build.timestamp}\'</value>
                        </replacement>
                        <!--requirejs的参数-->
                        <replacement>
                            <token>urlArgs: \'v=#\{.*\}\'</token>
                            <value>urlArgs: \'v=#\{${maven.build.timestamp}\}\'</value>
                        </replacement>
                    </replacements>
                </configuration>
            </plugin>
            <!--...-->
        </plugins>
    </build>
</project>
```

## 二、时间戳时区

上面的配置其实已经可以解决问题了。但因为`maven.build.timestamp`使用的是 UTC 时间，无法配置时区，我们可以看到添加的时间戳与北京时间差了 8 小时。

不过自带组件解决不了，我们可以用其他组件解决一下。

这里引入 `build-helper-maven-plugin` 插件来添加一个当前时区的时间属性`build.time`，然后将`maven.build.timestamp`替换成`build.time`即可。

完整参考：

```xml
<project>
    <dependencies>
        <!--...-->
        <dependency>
            <groupId>com.google.code.maven-replacer-plugin</groupId>
            <artifactId>replacer</artifactId>
            <version>1.5.3</version>
        </dependency>
        <dependency>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>build-helper-maven-plugin</artifactId>
            <version>3.3.0</version>
        </dependency>
        <!--...-->
    </dependencies>
    <build>
        <plugins>
            <!--...-->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>build-helper-maven-plugin</artifactId>
                <version>3.3.0</version>
                <executions>
                    <execution>
                        <id>timestamp-property</id>
                        <goals>
                            <goal>timestamp-property</goal>
                        </goals>
                        <configuration>
                            <name>build.time</name>
                            <pattern>yyyyMMddHHmmss</pattern>
                            <locale>zh_CN</locale>
                            <timeZone>GMT+8</timeZone>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
            <plugin>
                <groupId>com.google.code.maven-replacer-plugin</groupId>
                <artifactId>replacer</artifactId>
                <version>1.5.3</version>
                <executions>
                    <execution>
                        <phase>prepare-package</phase>
                        <goals>
                            <goal>replace</goal>
                        </goals>
                    </execution>
                </executions>
                <configuration>
                    <!--定位到target文件夹-->
                    <basedir>${project.build.directory}</basedir>
                    <includes>
                        <!--匹配ftl和html文件-->
                        <include>*.ftl</include>
                        <include>**/*.ftl</include>
                        <include>*.html</include>
                        <include>**/*.html</include>
                    </includes>
                    <replacements>
                        <!--分别匹配单引号和双引号版本-->
                        <replacement>
                            <token>\.css\"</token>
                            <value>.css?v=${build.time}\"</value>
                        </replacement>
                        <replacement>
                            <token>\.css\'</token>
                            <value>.css?v=${build.time}\'</value>
                        </replacement>
                        <replacement>
                            <token>\.js\"</token>
                            <value>.js?v=${build.time}\"</value>
                        </replacement>
                        <replacement>
                            <token>\.js\'</token>
                            <value>.js?v=${build.time}\'</value>
                        </replacement>
                        <!--requirejs的参数-->
                        <replacement>
                            <token>urlArgs: \'v=#\{.*\}\'</token>
                            <value>urlArgs: \'v=#\{${build.time}\}\'</value>
                        </replacement>
                    </replacements>
                </configuration>
            </plugin>
            <!--...-->
        </plugins>
    </build>
</project>
```
