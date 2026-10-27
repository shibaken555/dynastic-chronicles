import { customAlphabet } from 'nanoid';

// publicIdを生成する際の候補となる文字列(半角英数字)
const ID_ALPHABET: string = "0123456789abcdefghijklmnopqrstuvwxyz";
// publicIdのプレフィックスを除いた桁数
const PUBLIC_ID_LENGTH: number = 10;

// publicIdを生成する関数
const generateId = customAlphabet(ID_ALPHABET, PUBLIC_ID_LENGTH);
// publicIdで使用されるプレフィックス
const prefixes = ["pls_", "mon_"] as const;
type Prefix = (typeof prefixes)[number];

// TODO:カスタム例外を投げる処理は今後追加予定。
// TODO:publicIDが重複した場合のリトライ処理は今後追加予定。
// 一旦動作確認をすることを優先
export function generatePublicId(prefix: Prefix): string {
    return prefix + generateId();
}