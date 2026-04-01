# Ke hoach trien khai CRM (User/Admin, KOL, Social, Affiliate, Automation)

## 1. Muc tieu tong
- Xay dung he thong phan quyen ro rang `admin`, `user`, `kol`.
- Co module `Settings` cho KOL va thong tin tich hop kenh social.
- Quan ly va dang noi dung len da kenh (TikTok, Instagram, YouTube, ...).
- Gan link affiliate cho tung noi dung va do luong hieu qua click/chuyen doi.
- Co lich tao va dang video tu dong tu CRM.
- Tach API key theo tung khach hang, khong dung key ca nhan.

## 2. Backlog uu tien (theo thu tu lam)

### P0 - Nen tang bat buoc
1. Phan cap tai khoan (RBAC)
- Tao `roles`: `admin`, `manager`, `kol`, `viewer`.
- Tao `permissions`: quan ly user, quan ly social account, dang bai, xem bao cao, quan ly key.
- Gan role cho `users` va middleware check quyen theo route.
- Definition of Done:
	- Admin tao/sua/xoa user va gan role duoc.
	- User khong co quyen thi bi chan route/API.

2. Settings cho KOL
- Tao trang `settings/kol` gom:
	- Ho so KOL (cac cot bat buoc): `name`, `gender`, `apparent_age`, `ethnicity`, `face_shape`, `default_expression`, `eye_type`, `hair_style`, `hair_color`, `skin_tone`, `body_type`.
	- Them cot `tiktok_url` (duong link den kenh TikTok cua KOL). Tren UI dang bang danh sach, cot nay phai la link co the bam duoc; bam vao thi mo trang TikTok cua KOL (tab moi).
	- Du lieu mau can luu duoc:
	  - `name`: `Kol 1`
	  - `gender`: `female`
	  - `apparent_age`: `early-20s`
	  - `ethnicity`: `vietnamese`
	  - `face_shape`: `oval`
	  - `default_expression`: `confident`
	  - `eye_type`: `almond`
	  - `hair_style`: `long-straight`
	  - `hair_color`: `black`
	  - `skin_tone`: `light-warm`
	  - `body_type`: `slim`
	- Cau hinh kenh mac dinh: TikTok/IG/YT.
	- Tuy chon tracking mac dinh (utm_source, utm_campaign).
- Luu du lieu vao bang `kol_profiles` va `kol_preferences`.
- Definition of Done:
	- KOL cap nhat profile duoc, du lieu luu va tai lai dung.
	- Cot `tiktok_url` hien thi dang link bam duoc va mo dung trang kenh TikTok.

3. Kho luu API key theo tenant/customer
- Tao module `customer_integrations` hoac `integration_credentials`.
- Luu key dang ma hoa (Laravel `encrypt`/`decrypt`, khong plaintext).
- Mỗi customer dung key rieng cho automation job.
- Them trang UI de khach them/sua/revoke key.
- Definition of Done:
	- Job auto lay key theo `customer_id`, khong dung key global.

### P1 - Social publishing + affiliate
4. Quan ly social account da kenh
- Tao 1 tab `Channels` de quan ly danh sach cac kenh dang co (YouTube, TikTok, Instagram) va duong link dan den tung kenh.
- Tren tab `Channels`, can co nut `Add new channel` de user tu tao mot kenh moi.
- Tao bang `social_accounts`:
	- `customer_id`, `platform` (tiktok, instagram, youtube), `channel_name`, `channel_url`, `status`.
- Them trang ket noi/ngat ket noi tai khoan social.
- MVP chua can OAuth token (`access_token`, `refresh_token`) va chua can job refresh token.
- OAuth + token refresh se dua vao phase sau khi can auto publish/sync analytics bang API chinh thuc.
- Definition of Done:
	- User xem duoc danh sach kenh theo dang bang tren tab `Channels`.
	- Cot link kenh bam duoc va mo dung trang kenh.
	- User tao duoc kenh moi bang nut `Add new channel`.
	- User sua/xoa duoc kenh da tao.
	- Moi customer co the map nhieu kenh, thay duoc trang thai ket noi.

5. Dang video + gan affiliate link
- Tao bang `content_items` (video metadata) va `publish_jobs`.
- Luong dang:
	- Upload/chon video.
	- Chon kenh muon dang.
	- Sinh link affiliate rut gon cho moi kenh.
	- Chen link vao description/comment pin tuy platform support.
- Definition of Done:
	- 1 video dang duoc >= 1 kenh, co luu `external_post_id`.

6. Tracking click va hieu qua
- Tao bang `affiliate_links`, `link_click_events`, `conversion_events`.
- Mỗi link co ma theo doi rieng (`short_code` + UTM).
- Dashboard KPI:
	- Click, CTR, conversion rate, doanh thu (neu co), top kenh/top KOL/top campaign.
- Definition of Done:
	- Xem duoc bao cao theo khoang ngay va theo platform.

### P2 - Automation/lap lich
7. Lap lich tao video va dang tu dong tu CRM
- Tao `automation_workflows` + `automation_runs`.
- Luong goi y:
	- Input brief/campaign.
	- Sinh script/caption (neu co AI).
	- Tao task media (cho editor hoac API generation).
	- Dat lich publish da kenh.
- Su dung Laravel Queue + Scheduler (`queue:work`, `schedule:run`).
- Definition of Done:
	- Tao workflow, dat lich, job chay dung gio, co log ket qua.

## 3. De xuat model du lieu toi thieu
- `roles`, `permissions`, `model_has_roles`, `role_has_permissions`.
- `customers`.
- `kol_profiles` (`user_id`, `customer_id`, fields profile).
- `integration_credentials` (`customer_id`, `provider`, `encrypted_secret`, `status`).
- `social_accounts` (`customer_id`, `platform`, `channel_name`, `channel_url`, `status`).
- Phase sau (khong nam trong MVP): bo sung OAuth columns (`access_token`, `refresh_token`, `token_expires_at`) khi bat dau auto publish/sync analytics.
- `content_items` (`customer_id`, `owner_user_id`, `video_path`, `caption`, `status`).
- `publish_jobs` (`content_item_id`, `social_account_id`, `scheduled_at`, `published_at`, `external_post_id`, `status`).
- `affiliate_links` (`customer_id`, `content_item_id`, `platform`, `destination_url`, `short_code`).
- `link_click_events` (`affiliate_link_id`, `clicked_at`, `referrer`, `device`, `ip_hash`).
- `conversion_events` (`affiliate_link_id`, `amount`, `currency`, `event_at`).

## 4. Phan chia sprint de lam nhanh
1. Sprint 1 (1-2 tuan)
- RBAC + Settings KOL + Credential vault (API key theo customer).

2. Sprint 2 (1-2 tuan)
- MVP Channels: danh sach kenh + Add/Edit/Delete + link den kenh.
- Sau MVP moi lam auto publish 1 kenh dau tien (nen lam YouTube truoc vi API ro rang hon).

3. Sprint 3 (1-2 tuan)
- Affiliate link tracking + dashboard KPI co ban.

4. Sprint 4 (1-2 tuan)
- Workflow automation + schedule publish da kenh.

## 5. Rui ro can nghien cuu som
- TikTok/Instagram API han che quyen publish, can kiem tra policy va scope som.
- Chinh sach affiliate cua tung nen tang co the cam link truc tiep (co the can landing page trung gian).
- Bao mat key: bat buoc ma hoa, phan quyen xem/sua key, audit log thay doi.
- Rate limit API: can retry/backoff va dead-letter queue.

## 6. Checklist ky thuat truoc khi code
- Chon thu vien RBAC (goi y: `spatie/laravel-permission`).
- Chuan hoa tenant/customer context cho moi request/job.
- Dinh nghia convention log + event tracking ngay tu dau.
- Thiet ke API contract cho module publish/tracking/automation.

## 7. Viec nen lam ngay hom nay
1. Chot role/permission matrix voi team.
2. Tao migration cho `customers`, `roles`, `integration_credentials`.
3. Dung UI Settings KOL (form + validate + save).
4. Tao proof-of-concept publish 1 kenh dau tien + 1 affiliate link tracking.
