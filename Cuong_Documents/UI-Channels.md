# UI Channels V2 Spec (Updated)

## 1. Mục tiêu tài liệu
- Mô tả đầy đủ UI/UX tab `Channels` bản V2.
- Tổng hợp các thay đổi đã implement trong code hiện tại.
- Giải thích các khái niệm OAuth, token, connect theo cách người mới có thể hiểu.

## 2. Tổng quan nghiệp vụ
- Tab `Channels` dùng để quản lý kênh social của customer: YouTube, TikTok, Instagram.
- Mục tiêu V2:
  - Vẫn quản lý danh sách kênh gọn gàng.
  - Sẵn sàng cho OAuth và upload tự động giai đoạn sau.
  - Không hiển thị token thuần văn bản trên UI.

## 3. Changelog UI đã cập nhật (thực tế)
### 3.1 Thay đổi tổng quan màn hình
- Nút `Add new channel` đã được đưa ra ngoài card bảng, đặt phía trên bên phải.
- Bảng dữ liệu sử dụng horizontal scroll khi màn hình hẹp.
- Các cột được giữ `whitespace-nowrap` để tránh vỡ dòng.

### 3.2 Dialog Add/Edit
- Dialog hiển thị dạng modal căn giữa màn hình (render qua portal vào `document.body`).
- Nền phía sau modal tối 25% (`bg-black/25`).
- Add dialog:
  - Có `Create mode`, `Platform`, `Channel name`.
  - Nếu `Manual` thì hiện thêm `Channel URL`.
  - Không hiển thị `Status`.
- Edit dialog:
  - Có `Status`.
  - Có khối thông tin read-only liên quan kết nối/token.

### 3.3 Bảng thông tin
- Cột hiện có:
  - `#` (có chấm xanh cho kênh mới tạo)
  - `Channel name`
  - `Platform` (badge + icon)
  - `Channel URL`
  - `Connection`
  - `Scopes`
  - `Token Expiry`
  - `Last Sync`
  - `Status`
  - `Actions`
- Đã bỏ hiển thị dòng chữ nhỏ `external_channel_id` ở cột tên kênh theo feedback.

### 3.4 Cột Actions
- Đã gom 3 hành động liên quan kết nối vào một nút cha `Connection tools`.
- Khi bấm nút cha, menu con thả xuống bên dưới (dạng dọc):
  - `Connect/Reconnect`
  - `Disconnect`
  - `Test`
- Mỗi nút con có tooltip giải thích chức năng.

## 4. Giải thích dễ hiểu: OAuth, Connect, Token
### 4.1 OAuth là gì?
- OAuth là cơ chế cấp quyền an toàn.
- Ví dụ dễ hiểu:
  - CRM cần upload video lên YouTube thay bạn.
  - Bạn đăng nhập YouTube và bấm "Đồng ý" cấp quyền cho CRM.
  - CRM nhận được token để thay mặt bạn gọi API.
- CRM không cần biết mật khẩu YouTube của bạn.

### 4.2 Connect / Reconnect / Disconnect / Test là gì?
- `Connect`:
  - Thiết lập kết nối lần đầu qua OAuth.
  - Dùng khi channel chưa cấp quyền cho CRM.
- `Reconnect`:
  - Kết nối lại khi token hết hạn hoặc quyền bị lỗi.
  - Bản chất là cấp quyền lại.
- `Disconnect`:
  - Ngắt kết nối channel khỏi CRM.
  - Sau đó CRM không thể upload/sync channel này.
- `Test`:
  - Thử kết nối hiện tại còn hợp lệ không.
  - Kiểm tra token + scope.

### 4.3 Access token và Refresh token là gì?
- `access_token`:
  - Tạm hiểu là "vé vào cửa tạm thời" để gọi API.
  - Thường có hạn sử dụng ngắn.
- `refresh_token`:
  - Dùng để xin `access_token` mới khi access token hết hạn.
  - Không cần bắt user đăng nhập lại liên tục.

### 4.4 Token expiry là gì?
- `token_expires_at` = thời điểm access token hết hạn.
- Nếu quá mốc này, API có thể trả lời 401/unauthorized.
- Hệ thống cần refresh token trước hoặc ngay khi hết hạn.

### 4.5 Scopes là gì?
- Scope = danh sách quyền CRM được phép làm.
- Ví dụ:
  - `upload`
  - `analytics.read`
  - `channel.read`
- Thiếu scope thì dù có token vẫn có thể bị từ chối API.

### 4.6 Session khác token như thế nào?
- Session đăng nhập web:
  - Dùng để giữ user đang nhập CRM.
- OAuth token:
  - Dùng để CRM gọi API của YouTube/TikTok/Instagram.
- Hai cái này khác nhau, không thay thế nhau.

## 5. Quy tắc bảo mật cần nhớ
- Tuyệt đối không hiển thị raw token trên UI.
- Lưu token đã mã hóa ở backend.
- Hạn chế quyền xem/chỉnh sửa kết nối theo role.
- Có audit log cho các hành động connect/disconnect/reconnect.

## 6. Data model đề xuất (V2)
- `social_accounts`:
  - `id`, `customer_id`, `platform`, `channel_name`, `channel_url`, `external_channel_id`, `status`
  - `connection_status`, `token_expires_at`, `last_sync_at`, `last_error`
  - `created_at`, `updated_at`

- `social_account_scopes`:
  - `social_account_id`, `scope`

- `social_account_tokens` (backend only, encrypted):
  - `social_account_id`, `access_token_encrypted`, `refresh_token_encrypted`, `expires_at`, `refreshed_at`

## 7. API contract đề xuất
- `GET /channels`
- `POST /channels/provision` (mock provision hiện tại)
- `POST /channels` (manual create, phase sau)
- `PUT /channels/{id}`
- `DELETE /channels/{id}`
- `POST /channels/{id}/connect`
- `GET /channels/oauth/callback`
- `POST /channels/{id}/disconnect`
- `POST /channels/{id}/test`
- `POST /channels/{id}/refresh-token` (internal/job)

## 8. Acceptance criteria V2
- Add dialog không hiển thị `Status`; Edit dialog có `Status`.
- Action menu `Connection tools` mở theo chiều dọc xuống dưới.
- URL bấm được và mở đúng channel.
- Bảng không vỡ dòng xấu khi màn hình hẹp (scroll ngang).
- Row mới tạo có chấm xanh ở cột `#`.
- Hiển thị đủ các cột OAuth-ready (`Connection`, `Scopes`, `Token Expiry`, `Last Sync`).
- UI không hiển thị access/refresh token dạng text.

## 9. Ghi chú cho PM/BA (non-technical)
- Nếu team chưa cần upload tự động ngay:
  - Có thể chạy MVP với link + status.
- Nếu muốn upload/sync thật:
  - Bắt buộc phải có OAuth/token/scope.
  - Đây là lý do phần `Connection/Token` xuất hiện trong V2.
