# UI - Tab `KOL`

## 1. Mục tiêu
- Tạo tab `KOL` để quản lý danh sách KOL profile phục vụ tạo nội dung.
- Cho phép user thêm KOL theo 2 luồng:
  - Upload ảnh KOL có sẵn từ máy tính.
  - Nhập/chọn thuộc tính profile và bấm `Create KOL` để hệ thống tạo ảnh preview.
- Chỉ khi có ảnh preview hợp lệ thì mới cho phép thêm KOL vào danh sách bằng nút `Add KOL to list`.

## 2. Bố cục trang
- Menu `KOL` là tab top-level.
- Header trang gồm:
  - Tiêu đề `KOL`.
  - Mô tả ngắn về quản lý profile.
  - Nút chính `Add New KOL`.
- Nội dung chính là bảng danh sách KOL.

## 3. Bảng danh sách KOL

### 3.1. Cột hiển thị
1. `Name`
2. `Image`
3. `Gender`
4. `Apparent Age`
5. `Ethnicity`
6. `Face Shape`
7. `Default Expression`
8. `Eye Type`
9. `Hair Style`
10. `Hair Color`
11. `Skin Tone`
12. `Body Type`
13. `Actions`

### 3.2. Quy tắc hiển thị
- Cột `Image` hiển thị thumbnail tròn.
- Hover vào thumbnail hiển thị popup preview ảnh lớn.
- Các thuộc tính text hiển thị dạng badge để dễ quét thông tin.
- Bảng hỗ trợ scroll ngang nếu màn hình hẹp.

### 3.3. Actions
- Hiện có nút `Delete` cho từng KOL.
- Khi bấm `Delete`, hệ thống yêu cầu confirm trước khi xóa.

## 4. Dialog `Add New KOL`

### 4.1. Cấu trúc 2 cột
- Cột trái: form thuộc tính KOL.
- Cột phải: khu upload + preview ảnh.

### 4.2. Trường dữ liệu profile
- `Name` (bắt buộc)
- `Gender`
- `Apparent Age`
- `Ethnicity`
- `Face Shape`
- `Default Expression`
- `Eye Type`
- `Hair Style`
- `Hair Color`
- `Skin Tone`
- `Body Type`

### 4.3. Nút trong dialog
- `Create KOL` (màu tím, icon `wand`): tạo ảnh preview từ dữ liệu form.
- `Add KOL to list` (màu xanh lá, icon `plus`): thêm KOL vào bảng danh sách.

## 5. Luồng nghiệp vụ chi tiết

### 5.1. Luồng A - Upload ảnh từ máy tính
1. User bấm `Upload image` và chọn file.
2. Hệ thống đọc file ảnh, cập nhật preview ở cột phải.
3. Hệ thống tự động điền một phần profile gợi ý (mock bằng seed từ tên file).
4. Trạng thái `image_locked = true`.
5. Nút `Create KOL` bị disable khi còn ảnh upload.
6. User có thể bấm `X` ở preview để xóa ảnh:
   - Xóa `image_url`.
   - Reset `image_file`.
   - `image_locked = false`.
   - Nút `Create KOL` được enable lại.
7. Khi đã có preview ảnh (upload), user bấm `Add KOL to list` để thêm vào bảng.

### 5.2. Luồng B - Nhập tay rồi tạo ảnh bằng `Create KOL`
1. User nhập/chọn các thuộc tính profile.
2. User bấm `Create KOL`.
3. Khu preview hiển thị spinner `Generating KOL image...` trong lúc xử lý.
4. Sau khi xử lý xong, hệ thống gán ảnh preview sinh từ dữ liệu input (hiện tại là ảnh SVG mock).
5. Nút `Add KOL to list` sáng khi `image_url` đã có.
6. User bấm `Add KOL to list` để thêm KOL vào danh sách.

### 5.3. Rule bắt buộc khi thêm vào danh sách
- `Name` không được rỗng.
- `image_url` phải tồn tại (từ upload hoặc từ create).
- Nếu thiếu điều kiện, hiển thị notice lỗi và không thêm vào bảng.

## 6. Trạng thái UI và điều kiện enable/disable

### 6.1. `Create KOL`
- Disable khi:
  - `isCreatingPreview = true`.
  - hoặc `image_locked = true` (đang giữ ảnh upload từ máy).
- Enable lại khi user xóa ảnh upload bằng nút `X`.

### 6.2. `Add KOL to list`
- Disable khi:
  - chưa có `image_url`.
  - hoặc đang `isCreatingPreview = true`.
- Enable khi preview ảnh đã sẵn sàng.

### 6.3. Spinner preview
- Chỉ hiển thị khi `isCreatingPreview = true`.
- Spinner thay thế vùng ảnh trong khung preview.

## 7. Notice và thông báo
- Lỗi bắt buộc tên: `Please fill in KOL Name.`
- Lỗi thiếu ảnh: `Please choose a KOL image.`
- Thành công tạo preview: `KOL image has been generated.`
- Thành công thêm danh sách: `KOL has been added.`
- Thành công xóa item: `KOL has been deleted.`

## 8. Dữ liệu và mapping hiện tại
- Nguồn list KOL ban đầu: từ backend mock dataset.
- KOL thêm mới từ dialog: thêm local ở client state.
- Field dùng trong item KOL:
  - `slug`
  - `name`
  - `gender`
  - `apparent_age`
  - `ethnicity`
  - `face_shape`
  - `default_expression`
  - `eye_type`
  - `hair_style`
  - `hair_color`
  - `skin_tone`
  - `body_type`
  - `image_url`
  - `is_local`

## 9. Khuyến nghị backend/API cho phase tiếp theo
- `POST /kols/generate-image`
  - Input: toàn bộ thuộc tính profile.
  - Output: `image_url` hoặc binary ảnh.
- `POST /kols`
  - Tạo bản ghi KOL mới.
- `GET /kols`
  - Trả danh sách KOL.
- `DELETE /kols/{id}`
  - Xóa KOL.

## 10. Acceptance criteria
- Có 2 luồng tạo preview: upload hoặc create từ input.
- Khi upload ảnh, `Create KOL` bị disable đúng rule.
- Khi bấm `X` xóa ảnh upload, `Create KOL` enable lại.
- `Add KOL to list` chỉ bấm được khi đã có preview ảnh.
- Bấm `Add KOL to list` thì item mới xuất hiện ở đầu bảng KOL.
- Preview cột phải hiển thị đúng: spinner khi tạo, ảnh khi xong.
- Nút có icon đúng yêu cầu:
  - `Create KOL` dùng icon phù hợp tạo ảnh.
  - `Add KOL to list` có icon dấu cộng.
