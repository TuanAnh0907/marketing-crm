# UI - Tab `Videos`

## 1. Mục tiêu
- Tạo tab `Videos` để quản lý danh sách video theo sản phẩm.
- Cho phép user tạo video theo 2 luồng:
  - Upload sẵn video từ máy tính.
  - Không upload video, hệ thống tự chạy luồng ngầm để tạo video.
- Cho phép post video lên các kênh social đã có sẵn trong hệ thống.

## 2. Bố cục trang
- Menu `Videos` là một tab top-level.
- Header trang gồm:
  - Tiêu đề `Videos`.
  - Search box ở bên trái nút `Add New Video`.
  - Nút chính `Add New Video` ở bên phải.
- Nội dung chính là bảng danh sách video.

## 3. Search
- Search theo:
  - `Product ID`
  - `Product Name`
- Search là lọc phía UI trên danh sách đang hiển thị.
- Search không bắt buộc nhập.
- Khi không có kết quả, danh sách trống theo bộ lọc hiện tại.

## 4. Bảng danh sách video

### 4.1. Cột hiển thị đúng thứ tự
1. `#`
2. `Product ID`
3. `Product Name`
4. `Product Photo`
5. `Product Description`
6. `KOL Name`
7. `KOL Image`
8. `Video URL`
9. `Video Status`
10. `Post Status`
11. `Actions`

### 4.2. Quy tắc hiển thị
- `Product ID` là dữ liệu giả phục vụ UI, hiển thị ở mọi dòng.
- Nội dung text trong bảng phải tự break xuống dòng khi dài.
- Bảng không được tràn viền màn hình.
- Ở màn hình nhỏ, một số cột phụ có thể ẩn để giữ layout gọn.
- Cột `Actions` phải luôn nhìn thấy được.
- Nút `Post` và `Delete` được phép xuống hàng khi không đủ chỗ.

### 4.3. Status
#### `Video Status`
- `pending`: user bấm tạo video nhưng hệ thống đang tạo video ở luồng ngầm.
- `not_uploaded`: video đã tạo xong nhưng chưa upload.
- `uploaded`: user đã upload video từ máy tính lên.

#### `Post Status`
- `idle`: chưa post.
- `success`: post thành công.
- `failed`: post thất bại.

### 4.4. Nút `Post`
- Chỉ disable khi:
  - `video_status = uploaded`
  - và `post_status = success`
- Tất cả trường hợp khác nút `Post` vẫn phải sáng.
- Nếu video chưa phải `uploaded`, vẫn có thể bấm `Post` theo nghiệp vụ hiện tại.

## 5. Form thêm/sửa video

### 5.1. Trường dữ liệu
- `Product Name` - bắt buộc.
- `Product Photo` - upload ảnh từ máy tính, không bắt buộc.
- `Product Description` - bắt buộc.
- `KOL` - chọn từ danh sách KOL hiện có.
- `Number of videos` - chọn số lượng video muốn tạo, từ 1 đến 10.
- `Choose video` - upload video từ máy tính, cho phép chọn nhiều file từ 1 đến 10.

### 5.2. Hành vi của form
- Nếu user upload video từ máy tính:
  - Hệ thống tạo nhiều item tương ứng với số file đã chọn.
  - Mỗi item có `video_status = uploaded`.
  - `KOL` bị khóa để không chọn nữa.
- Nếu user không upload video:
  - Hệ thống tạo video theo `Number of videos`.
  - Tạo item với `video_status = pending`.
  - Sau đó chuyển sang `not_uploaded` khi luồng ngầm hoàn tất.
- `Number of videos` là control tăng giảm từ 1 đến 10.
- `Choose video` là tùy chọn, không bắt buộc.

### 5.3. Các lưu ý UI trong form
- Tiêu đề modal `Add new video` phải sticky ở đầu khi scroll.
- Nút chọn ảnh cần có icon, nằm bên trái, text trạng thái ảnh nằm bên phải.
- Khi chọn ảnh:
  - hiển thị preview thumbnail
  - hiển thị tên file ảnh
- Mô tả dưới nút chọn video phải viết bằng tiếng Anh.

## 6. Luồng xử lý nghiệp vụ

### 6.1. Tạo video mới
- User nhập thông tin sản phẩm.
- User chọn số lượng video muốn tạo.
- User có thể upload video sẵn hoặc không upload.
- Hệ thống tạo dữ liệu theo đúng batch tương ứng.

### 6.2. Auto-generation
- Nếu không upload video, hệ thống chạy luồng ngầm để tạo video.
- Trong lúc chờ, item ở trạng thái `pending`.
- Khi tạo xong, item chuyển sang `not_uploaded`.

### 6.3. Upload sẵn video
- Nếu user upload video từ máy tính, item được đánh dấu `uploaded`.
- Các KOL options bị disabled khi đã có video file.

### 6.4. Post video
- Bấm `Post` để mở modal chọn channel.
- Modal hiển thị thông tin video đang chọn.
- Chỉ cho chọn channel đang active.
- Bấm `Post Now` để tạo publish job.
- Khi publish thành công, `post_status` đổi sang `success`.
- Khi publish thất bại, `post_status` đổi sang `failed`.

## 7. Modal Post Video
- Tiêu đề: `Post Video to Existing Channel`.
- Hiển thị thông tin video đang chọn.
- Chỉ liệt kê channel active.
- Mỗi channel hiển thị theo format:
  - `[platform] channel_name`
- Nếu không có channel active, hiển thị trạng thái rỗng và link sang `Channels`.

## 8. Mapping dữ liệu gợi ý
- Bảng `content_items` nên có các field:
  - `id`
  - `product_id`
  - `product_name`
  - `product_photo_url`
  - `product_description`
  - `kol_profile_id` (nullable)
  - `video_url`
  - `video_status`
  - `post_status`
  - `created_at`
  - `updated_at`

- Bảng `publish_jobs` cho nút `Post`:
  - `id`
  - `content_item_id`
  - `social_account_id`
  - `scheduled_at` (nullable)
  - `published_at` (nullable)
  - `external_post_id` (nullable)
  - `status` (`pending`, `success`, `failed`)
  - `error_message` (nullable)

## 9. API/Backend contract gợi ý
- `GET /videos`
  - Trả danh sách video cho bảng.

- `POST /videos`
  - Tạo video mới.

- `PUT /videos/{id}`
  - Cập nhật video.

- `DELETE /videos/{id}`
  - Xóa video.

- `GET /channels/options`
  - Trả danh sách channel active.

- `POST /videos/{id}/publish`
  - Payload: `social_account_ids: number[]`.
  - Kết quả: tạo 1..n bản ghi `publish_jobs`.

## 10. Tiêu chí hoàn thành
- Tab `Videos` hiển thị đúng bảng và có cột `Product ID`.
- Search box lọc được theo `Product ID` và `Product Name`.
- Form tạo video có `Number of videos` dạng tăng giảm 1-10.
- `Choose video` cho phép chọn nhiều file từ máy tính.
- `KOL` bị khóa khi đã chọn video file.
- `Video Status` và `Post Status` tách riêng rõ ràng.
- `Post` chỉ bị disable khi video đã `uploaded` và `post_status = success`.
- Header modal `Add new video` sticky khi scroll.
- Bảng không bị tràn viền, text tự wrap hợp lý, nút `Delete` có thể xuống hàng khi cần.
