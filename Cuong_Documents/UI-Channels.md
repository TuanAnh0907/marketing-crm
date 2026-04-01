# UI Channels V2 Spec (Updated)

## 1. Muc tieu tai lieu
- Mo ta day du UI/UX tab `Channels` ban V2.
- Tong hop cac thay doi da implement trong code hien tai.
- Giai thich cac khai niem OAuth, token, connect theo cach nguoi moi co the hieu.

## 2. Tong quan nghiep vu
- Tab `Channels` dung de quan ly kenh social cua customer: YouTube, TikTok, Instagram.
- Muc tieu V2:
  - Van quan ly danh sach kenh gon gang.
  - San sang cho OAuth va upload tu dong giai doan sau.
  - Khong hien thi token thuan van ban tren UI.

## 3. Changelog UI da cap nhat (thuc te)
### 3.1 Thay doi tong quan man hinh
- Nut `Add new channel` da duoc dua ra ngoai card bang, dat phia tren ben phai.
- Bang du lieu su dung horizontal scroll khi man hinh hep.
- Cac cot duoc giu `whitespace-nowrap` de tranh vo dong.

### 3.2 Dialog Add/Edit
- Dialog hien thi dang modal can giua man hinh (render qua portal vao `document.body`).
- Nen phia sau modal toi 25% (`bg-black/25`).
- Add dialog:
  - Co `Create mode`, `Platform`, `Channel name`.
  - Neu `Manual` thi hien them `Channel URL`.
  - Khong hien thi `Status`.
- Edit dialog:
  - Co `Status`.
  - Co khoi thong tin read-only lien quan ket noi/token.

### 3.3 Bang thong tin
- Cot hien co:
  - `#` (co cham xanh cho kenh moi tao)
  - `Channel name`
  - `Platform` (badge + icon)
  - `Channel URL`
  - `Connection`
  - `Scopes`
  - `Token Expiry`
  - `Last Sync`
  - `Status`
  - `Actions`
- Da bo hien thi dong chu nho `external_channel_id` o cot ten kenh theo feedback.

### 3.4 Cot Actions
- Da gom 3 hanh dong lien quan ket noi vao mot nut cha `Connection tools`.
- Khi bam nut cha, menu con thoa xuong ben duoi (dang dọc):
  - `Connect/Reconnect`
  - `Disconnect`
  - `Test`
- Moi nut con co tooltip giai thich chuc nang.

## 4. Giai thich de hieu: OAuth, Connect, Token
### 4.1 OAuth la gi?
- OAuth la co che cap quyen an toan.
- Vi du de hieu:
  - CRM can upload video len YouTube thay ban.
  - Ban dang nhap YouTube va bam "Dong y" cap quyen cho CRM.
  - CRM nhan duoc token de thay mat ban goi API.
- CRM khong can biet mat khau YouTube cua ban.

### 4.2 Connect / Reconnect / Disconnect / Test la gi?
- `Connect`:
  - Thiet lap ket noi lan dau qua OAuth.
  - Dung khi channel chua cap quyen cho CRM.
- `Reconnect`:
  - Ket noi lai khi token het han hoac quyen bi loi.
  - Ban chat la cap quyen lai.
- `Disconnect`:
  - Ngat ket noi channel khoi CRM.
  - Sau do CRM khong the upload/sync channel nay.
- `Test`:
  - Thu ket noi hien tai con hop le khong.
  - Kiem tra token + scope.

### 4.3 Access token va Refresh token la gi?
- `access_token`:
  - Tam hieu la "ve vao cua tam thoi" de goi API.
  - Thuong co han su dung ngan.
- `refresh_token`:
  - Dung de xin `access_token` moi khi access token het han.
  - Khong can bat user dang nhap lai lien tuc.

### 4.4 Token expiry la gi?
- `token_expires_at` = thoi diem access token het han.
- Neu qua moc nay, API co the tra loi 401/unauthorized.
- He thong can refresh token truoc hoac ngay khi het han.

### 4.5 Scopes la gi?
- Scope = danh sach quyen CRM duoc phep lam.
- Vi du:
  - `upload`
  - `analytics.read`
  - `channel.read`
- Thieu scope thi du co token van co the bi tu choi API.

### 4.6 Session khac token nhu the nao?
- Session dang nhap web:
  - Dung de giu user dang nhap CRM.
- OAuth token:
  - Dung de CRM goi API cua YouTube/TikTok/Instagram.
- Hai cai nay khac nhau, khong thay the nhau.

## 5. Quy tac bao mat can nho
- Tuyet doi khong hien thi raw token tren UI.
- Luu token da ma hoa o backend.
- Han che quyen xem/chinh sua ket noi theo role.
- Co audit log cho cac hanh dong connect/disconnect/reconnect.

## 6. Data model de xuat (V2)
- `social_accounts`:
  - `id`, `customer_id`, `platform`, `channel_name`, `channel_url`, `external_channel_id`, `status`
  - `connection_status`, `token_expires_at`, `last_sync_at`, `last_error`
  - `created_at`, `updated_at`

- `social_account_scopes`:
  - `social_account_id`, `scope`

- `social_account_tokens` (backend only, encrypted):
  - `social_account_id`, `access_token_encrypted`, `refresh_token_encrypted`, `expires_at`, `refreshed_at`

## 7. API contract de xuat
- `GET /channels`
- `POST /channels/provision` (mock provision hien tai)
- `POST /channels` (manual create, phase sau)
- `PUT /channels/{id}`
- `DELETE /channels/{id}`
- `POST /channels/{id}/connect`
- `GET /channels/oauth/callback`
- `POST /channels/{id}/disconnect`
- `POST /channels/{id}/test`
- `POST /channels/{id}/refresh-token` (internal/job)

## 8. Acceptance criteria V2
- Add dialog khong hien thi `Status`; Edit dialog co `Status`.
- Action menu `Connection tools` mo theo chieu doc xuong duoi.
- URL bam duoc va mo dung channel.
- Bang khong vo dong xau khi man hinh hep (scroll ngang).
- Row moi tao co cham xanh o cot `#`.
- Hien du cac cot OAuth-ready (`Connection`, `Scopes`, `Token Expiry`, `Last Sync`).
- UI khong hien thi access/refresh token dang text.

## 9. Ghi chu cho PM/BA (non-technical)
- Neu team chua can upload tu dong ngay:
  - Co the chay MVP voi link + status.
- Neu muon upload/sync that:
  - Bat buoc phai co OAuth/token/scope.
  - Day la ly do phan `Connection/Token` xuat hien trong V2.
