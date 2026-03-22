package repository

import (
	"time"
	"github.com/jmoiron/sqlx"
)

// WalletModel 对应你的数据库表结构
type WalletModel struct {
	ID                  int       `db:"id"`
	TGUserID            int64     `db:"tg_user_id"`
	Chain               string    `db:"chain"`
	Address             string    `db:"address"`
	EncryptedPrivateKey string    `db:"encrypted_private_key"`
	CreatedAt           time.Time `db:"created_at"`
}

type WalletRepository struct {
	db *sqlx.DB
}

func NewWalletRepository(db *sqlx.DB) *WalletRepository {
	return &WalletRepository{db: db}
}

// Save 保存新生成的钱包
func (r *WalletRepository) Save(w *WalletModel) error {
	query := `INSERT INTO wallets (tg_user_id, chain, address, encrypted_private_key) 
			  VALUES (:tg_user_id, :chain, :address, :encrypted_private_key)`
	_, err := r.db.NamedExec(query, w)
	return err
}

// FindByTGID 根据 TG ID 和链类型查找
func (r *WalletRepository) FindByTGID(tgID int64, chain string) (*WalletModel, error) {
	var wallet WalletModel
	query := `SELECT * FROM wallets WHERE tg_user_id=$1 AND chain=$2 LIMIT 1`
	err := r.db.Get(&wallet, query, tgID, chain)
	return &wallet, err
}