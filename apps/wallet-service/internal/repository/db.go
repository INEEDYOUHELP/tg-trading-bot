package repository

import (
	"fmt" //用于格式化字符串
	"os"	//读取环境变量
	"github.com/jmoiron/sqlx" //基于标准库database/sql的增强版库，提供更便捷的 SQL 操作
	_ "github.com/lib/pq" // PostgreSQL 驱动
)

func NewPostgresDB() (*sqlx.DB, error) {
	dsn := fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=%s",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_PORT"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_SSLMODE"),
	)
	
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		return nil, err
	}
	return db, nil
}