## 分组查询

#### 语法
```sql
group by //分组字段
```

分组之后查询的字段：
- 分组字段
- 聚合函数

where和having的区别？
1. where在分组之前进行限定，如果不满足条件，则不参与分组。having在分组之后进行限定，如果不满足结果，则不会被查询出来。
2. where后不可以跟聚合函数，having可以进行聚合函数的判断。

## 分页查询
语法：limit 开始的索引，每页查询的条数

公式：开始的索引 = （当前的页码 - 1） * 每页显示的条数
```sql
SELECT * FROM crm_claim_apply LIMIT 0,3; -- 第一页
SELECT * FROM crm_claim_apply LIMIT 3,3; -- 第二页
SELECT * FROM crm_claim_apply LIMIT 6,3; -- 第三页
```

## 约束

概念：对表中的数据进行限定，保证数据的正确性，有效性和完整性。

分类：
1. 主键约束：primary key

    创建表时添加主键约束
    ```sql
    CREATE TABLE a_test(
	id INT PRIMARY KEY AUTO_INCREMENT, -- 给id添加主键约束，自动增长
	NAME VARCHAR(20)
    );
    ```
    删除主键约束
    ```sql
    ALTER TABLE a_test DROP PRIMARY KEY;
    ```
    创建完表后，添加主键约束
    ```sql
    ALTER TABLE a_test MODIFY id INT PRIMARY KEY;
    ```
    ::: warning
    1. 含义：非空且唯一
    2. 一张表只能有一个字段为主键
    3. 主键就是表中记录的唯一标识
    :::
2. 非空约束：not null

    创建表时添加非空约束
    ```sql
    CREATE TABLE a_test(
	id INT,
	NAME VARCHAR(20) NOT NULL
    );
    ```
    删除name的非空约束
    ```sql
    ALTER TABLE a_test MODIFY NAME VARCHAR(20);
    ```
    创建完表后，添加非空约束
    ```sql
    ALTER TABLE a_test MODIFY NAME VARCHAR(20) NOT NULL;
    ```
3. 唯一约束：unique
    创建表时添加条件唯一约束
    ```sql
    CREATE TABLE a_test(
	id INT,
	phone_number VARCHAR(20) UNIQUE -- 手机号
    );
    ```
    删除唯一约束
    ```sql
    ALTER TABLE a_test DROP INDEX phone_number;
    ```
    创建完表后，添加唯一约束
    ```sql
    ALTER TABLE a_test MODIFY phone_number VARCHAR(20) UNIQUE;
    ```
    ::: warning
    唯一约束可以有NULL值，但是只能有一条记录为null。
    :::
4. 外键约束：foreign key

    在创建表时，可以添加外键
    ```sql
    create table 表名(
        -- 外键列
        CONSTRAINT 外键名称 foreign key (外键列名称) references 主表名称(主表列名称)
    );
    ```
    删除外键
    ```sql
    ALTER TABLE 表名 DROP PRIMARY KEY 外键名称;
    ```
    创建完表后，添加外键
    ```sql
    ALTER TABLE 表名 ADD CONSTRAINT 外键名称 foreign key (外键列名称) references 主表名称;
    ```
5. 级联操作

    添加级联操作
    ```sql
    -- ON UPDATE CASCADE（级联更新）
    -- ON DELETE CASCADE（级联删除）
    ALTER TABLE 表名 ADD CONSTRAINT 外键名称 foreign key (外键列名称) references 主表名称 ON UPDATE CASCADE ON DELETE CASCADE;
    ```
