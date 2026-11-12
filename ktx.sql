USE [master]
GO
/****** Object:  Database [KTXthongminh]    Script Date: 10/11/2026 12:52:13 SA ******/
CREATE DATABASE [KTXthongminh]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'KTXthongminh', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\KTXthongminh.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'KTXthongminh_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\KTXthongminh_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [KTXthongminh] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [KTXthongminh].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [KTXthongminh] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [KTXthongminh] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [KTXthongminh] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [KTXthongminh] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [KTXthongminh] SET ARITHABORT OFF 
GO
ALTER DATABASE [KTXthongminh] SET AUTO_CLOSE ON 
GO
ALTER DATABASE [KTXthongminh] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [KTXthongminh] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [KTXthongminh] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [KTXthongminh] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [KTXthongminh] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [KTXthongminh] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [KTXthongminh] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [KTXthongminh] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [KTXthongminh] SET  DISABLE_BROKER 
GO
ALTER DATABASE [KTXthongminh] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [KTXthongminh] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [KTXthongminh] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [KTXthongminh] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [KTXthongminh] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [KTXthongminh] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [KTXthongminh] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [KTXthongminh] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [KTXthongminh] SET  MULTI_USER 
GO
ALTER DATABASE [KTXthongminh] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [KTXthongminh] SET DB_CHAINING OFF 
GO
ALTER DATABASE [KTXthongminh] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [KTXthongminh] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [KTXthongminh] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [KTXthongminh] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
ALTER DATABASE [KTXthongminh] SET QUERY_STORE = ON
GO
ALTER DATABASE [KTXthongminh] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [KTXthongminh]
GO
/****** Object:  Table [dbo].[Camera]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Camera](
	[CameraId] [int] IDENTITY(1,1) NOT NULL,
	[TenCamera] [nvarchar](50) NULL,
	[ViTri] [nvarchar](100) NULL,
	[IPAddress] [varchar](20) NULL,
	[StreamURL] [nvarchar](255) NULL,
	[TrangThai] [bit] NULL,
	[ToaNhaId] [varchar](10) NULL,
PRIMARY KEY CLUSTERED 
(
	[CameraId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DienNuoc]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DienNuoc](
	[DienNuocId] [int] IDENTITY(1,1) NOT NULL,
	[PhongId] [varchar](10) NOT NULL,
	[Thang] [int] NOT NULL,
	[Nam] [int] NOT NULL,
	[DienCu] [int] NULL,
	[DienMoi] [int] NULL,
	[NuocCu] [int] NULL,
	[NuocMoi] [int] NULL,
	[DonGiaDien] [decimal](18, 0) NULL,
	[DonGiaNuoc] [decimal](18, 0) NULL,
	[AnhCongTo] [nvarchar](255) NULL,
	[NguonNhap] [nvarchar](20) NULL,
	[NgayChot] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[DienNuocId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HoaDon]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HoaDon](
	[HoaDonId] [int] IDENTITY(1,1) NOT NULL,
	[MaHoaDon] [varchar](50) NULL,
	[PhongId] [varchar](10) NOT NULL,
	[MSSV] [varchar](20) NULL,
	[Thang] [int] NULL,
	[Nam] [int] NULL,
	[TienPhong] [decimal](18, 0) NULL,
	[TienDien] [decimal](18, 0) NULL,
	[TienNuoc] [decimal](18, 0) NULL,
	[PhiDichVu] [decimal](18, 0) NULL,
	[TongTien] [decimal](18, 0) NULL,
	[HanThanhToan] [date] NULL,
	[NgayThanhToan] [datetime] NULL,
	[PhuongThucTT] [nvarchar](50) NULL,
	[TrangThai] [nvarchar](20) NULL,
	[GhiChu] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[HoaDonId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[MaHoaDon] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[HopDong]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[HopDong](
	[HopDongId] [int] IDENTITY(1,1) NOT NULL,
	[MaHopDong] [varchar](50) NULL,
	[MSSV] [varchar](20) NOT NULL,
	[PhongId] [varchar](10) NOT NULL,
	[NgayTao] [datetime] NULL,
	[NgayBatDau] [date] NOT NULL,
	[NgayKetThuc] [date] NOT NULL,
	[ThoiHanThang] [int] NULL,
	[GiaPhongThang] [decimal](18, 0) NULL,
	[TienCoc] [decimal](18, 0) NULL,
	[TrangThai] [nvarchar](20) NULL,
	[NguoiDuyet] [nvarchar](50) NULL,
	[GhiChu] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[HopDongId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[MaHopDong] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Khach]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Khach](
	[KhachId] [int] IDENTITY(1,1) NOT NULL,
	[HoTen] [nvarchar](100) NOT NULL,
	[CCCD] [varchar](20) NULL,
	[SDT] [varchar](15) NULL,
	[MSSV_BaoLanh] [varchar](20) NOT NULL,
	[PhongThamId] [varchar](10) NULL,
	[LyDo] [nvarchar](200) NULL,
	[ThoiGianVaoDuKien] [datetime] NULL,
	[ThoiGianRaDuKien] [datetime] NULL,
	[ThoiGianVaoThucTe] [datetime] NULL,
	[ThoiGianRaThucTe] [datetime] NULL,
	[TrangThai] [nvarchar](20) NULL,
	[GhiChu] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[KhachId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LoaiPhong]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LoaiPhong](
	[LoaiPhongId] [int] IDENTITY(1,1) NOT NULL,
	[TenLoai] [nvarchar](50) NULL,
	[SoNguoiToiDa] [int] NOT NULL,
	[GiaChuan] [decimal](18, 0) NOT NULL,
	[TienIch] [nvarchar](max) NULL,
PRIMARY KEY CLUSTERED 
(
	[LoaiPhongId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[NhatKyAnNinh]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[NhatKyAnNinh](
	[LogId] [int] IDENTITY(1,1) NOT NULL,
	[CameraId] [int] NULL,
	[ThoiGian] [datetime] NULL,
	[LoaiSuKien] [nvarchar](50) NULL,
	[DoiTuongNhanDien] [nvarchar](100) NULL,
	[HinhAnhSnapshot] [nvarchar](255) NULL,
	[MucDoCanhBao] [nvarchar](20) NULL,
	[TrangThaiXuLy] [bit] NULL,
	[NguoiXuLy] [nvarchar](50) NULL,
	[GhiChuXuLy] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[LogId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[PhanAnh]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[PhanAnh](
	[PhanAnhId] [int] IDENTITY(1,1) NOT NULL,
	[MSSV] [varchar](20) NOT NULL,
	[PhongId] [varchar](10) NULL,
	[TieuDe] [nvarchar](200) NULL,
	[NoiDung] [nvarchar](max) NULL,
	[LoaiSuCo] [nvarchar](20) NULL,
	[HinhAnh] [nvarchar](255) NULL,
	[TrangThai] [nvarchar](20) NULL,
	[NgayGui] [datetime] NULL,
	[NgayTiepNhan] [datetime] NULL,
	[NgayHoanThanh] [datetime] NULL,
	[NguoiXuLy] [nvarchar](50) NULL,
	[KetQuaXuLy] [nvarchar](255) NULL,
	[ChiPhiPhatSinh] [decimal](18, 0) NULL,
PRIMARY KEY CLUSTERED 
(
	[PhanAnhId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Phong]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Phong](
	[PhongId] [varchar](10) NOT NULL,
	[TenPhong] [nvarchar](20) NOT NULL,
	[ToaNhaId] [varchar](10) NOT NULL,
	[LoaiPhongId] [int] NOT NULL,
	[Tang] [int] NULL,
	[SoNguoiHienTai] [int] NULL,
	[TrangThai] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[PhongId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SinhVien]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SinhVien](
	[MSSV] [varchar](20) NOT NULL,
	[TaiKhoanId] [int] NULL,
	[HoTen] [nvarchar](100) NOT NULL,
	[NgaySinh] [date] NULL,
	[GioiTinh] [nvarchar](10) NULL,
	[CCCD] [varchar](20) NULL,
	[SDT] [varchar](15) NULL,
	[Email] [nvarchar](100) NULL,
	[QueQuan] [nvarchar](200) NULL,
	[Lop] [nvarchar](50) NULL,
	[Khoa] [nvarchar](100) NULL,
	[FaceID_Data] [nvarchar](max) NULL,
	[HoTenNguoiThan] [nvarchar](100) NULL,
	[SDTNguoiThan] [varchar](15) NULL,
	[MoiQuanHe] [nvarchar](50) NULL,
	[PhongDangOId] [varchar](10) NULL,
	[TrangThai] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[MSSV] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[TaiKhoanId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[CCCD] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[TaiKhoan]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[TaiKhoan](
	[TaiKhoanId] [int] IDENTITY(1,1) NOT NULL,
	[TenDangNhap] [nvarchar](50) NOT NULL,
	[MatKhauHash] [nvarchar](255) NOT NULL,
	[VaiTroId] [int] NOT NULL,
	[AnhDaiDien] [nvarchar](255) NULL,
	[TrangThai] [bit] NULL,
	[LastLogin] [datetime] NULL,
	[NgayTao] [datetime] NULL,
PRIMARY KEY CLUSTERED 
(
	[TaiKhoanId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[TenDangNhap] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ThongBao]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ThongBao](
	[ThongBaoId] [int] IDENTITY(1,1) NOT NULL,
	[TieuDe] [nvarchar](200) NOT NULL,
	[NoiDung] [nvarchar](max) NULL,
	[LoaiThongBao] [nvarchar](20) NULL,
	[DoiTuongNhan] [nvarchar](20) NULL,
	[ChiTietDoiTuong] [nvarchar](50) NULL,
	[FileDinhKem] [nvarchar](255) NULL,
	[NgayGui] [datetime] NULL,
	[NguoiGui] [nvarchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[ThongBaoId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ToaNha]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ToaNha](
	[ToaNhaId] [varchar](10) NOT NULL,
	[TenToa] [nvarchar](50) NOT NULL,
	[SoTang] [int] NULL,
	[LoaiKhu] [nvarchar](20) NULL,
	[TruongNha] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[ToaNhaId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VaiTro]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VaiTro](
	[VaiTroId] [int] IDENTITY(1,1) NOT NULL,
	[TenVaiTro] [nvarchar](50) NOT NULL,
	[MoTa] [nvarchar](255) NULL,
PRIMARY KEY CLUSTERED 
(
	[VaiTroId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[VatTu]    Script Date: 10/11/2026 12:52:14 SA ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[VatTu](
	[VatTuId] [int] IDENTITY(1,1) NOT NULL,
	[MaTaiSan] [varchar](20) NULL,
	[TenVatTu] [nvarchar](100) NOT NULL,
	[LoaiVatTu] [nvarchar](50) NULL,
	[PhongId] [varchar](10) NULL,
	[NgayTrangBi] [date] NULL,
	[HanBaoHanh] [date] NULL,
	[TrangThai] [nvarchar](20) NULL,
PRIMARY KEY CLUSTERED 
(
	[VatTuId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY],
UNIQUE NONCLUSTERED 
(
	[MaTaiSan] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Camera] ADD  DEFAULT ((1)) FOR [TrangThai]
GO
ALTER TABLE [dbo].[DienNuoc] ADD  DEFAULT ((2500)) FOR [DonGiaDien]
GO
ALTER TABLE [dbo].[DienNuoc] ADD  DEFAULT ((6000)) FOR [DonGiaNuoc]
GO
ALTER TABLE [dbo].[DienNuoc] ADD  DEFAULT ('ThuCong') FOR [NguonNhap]
GO
ALTER TABLE [dbo].[DienNuoc] ADD  DEFAULT (getdate()) FOR [NgayChot]
GO
ALTER TABLE [dbo].[HoaDon] ADD  DEFAULT ((0)) FOR [TienPhong]
GO
ALTER TABLE [dbo].[HoaDon] ADD  DEFAULT ((0)) FOR [TienDien]
GO
ALTER TABLE [dbo].[HoaDon] ADD  DEFAULT ((0)) FOR [TienNuoc]
GO
ALTER TABLE [dbo].[HoaDon] ADD  DEFAULT ((0)) FOR [PhiDichVu]
GO
ALTER TABLE [dbo].[HoaDon] ADD  DEFAULT ('ChuaThanhToan') FOR [TrangThai]
GO
ALTER TABLE [dbo].[HopDong] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[HopDong] ADD  DEFAULT ('ChoDuyet') FOR [TrangThai]
GO
ALTER TABLE [dbo].[Khach] ADD  DEFAULT ('DangKy') FOR [TrangThai]
GO
ALTER TABLE [dbo].[NhatKyAnNinh] ADD  DEFAULT (getdate()) FOR [ThoiGian]
GO
ALTER TABLE [dbo].[NhatKyAnNinh] ADD  DEFAULT ((0)) FOR [TrangThaiXuLy]
GO
ALTER TABLE [dbo].[PhanAnh] ADD  DEFAULT ('ChoTiepNhan') FOR [TrangThai]
GO
ALTER TABLE [dbo].[PhanAnh] ADD  DEFAULT (getdate()) FOR [NgayGui]
GO
ALTER TABLE [dbo].[PhanAnh] ADD  DEFAULT ((0)) FOR [ChiPhiPhatSinh]
GO
ALTER TABLE [dbo].[Phong] ADD  DEFAULT ((0)) FOR [SoNguoiHienTai]
GO
ALTER TABLE [dbo].[Phong] ADD  DEFAULT ('Trong') FOR [TrangThai]
GO
ALTER TABLE [dbo].[SinhVien] ADD  DEFAULT ('ChuaThue') FOR [TrangThai]
GO
ALTER TABLE [dbo].[TaiKhoan] ADD  DEFAULT ((1)) FOR [TrangThai]
GO
ALTER TABLE [dbo].[TaiKhoan] ADD  DEFAULT (getdate()) FOR [NgayTao]
GO
ALTER TABLE [dbo].[ThongBao] ADD  DEFAULT (getdate()) FOR [NgayGui]
GO
ALTER TABLE [dbo].[VatTu] ADD  DEFAULT ('Tot') FOR [TrangThai]
GO
ALTER TABLE [dbo].[Camera]  WITH CHECK ADD FOREIGN KEY([ToaNhaId])
REFERENCES [dbo].[ToaNha] ([ToaNhaId])
GO
ALTER TABLE [dbo].[DienNuoc]  WITH CHECK ADD FOREIGN KEY([PhongId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[HoaDon]  WITH CHECK ADD FOREIGN KEY([MSSV])
REFERENCES [dbo].[SinhVien] ([MSSV])
GO
ALTER TABLE [dbo].[HoaDon]  WITH CHECK ADD FOREIGN KEY([PhongId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[HopDong]  WITH CHECK ADD FOREIGN KEY([MSSV])
REFERENCES [dbo].[SinhVien] ([MSSV])
GO
ALTER TABLE [dbo].[HopDong]  WITH CHECK ADD FOREIGN KEY([PhongId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[Khach]  WITH CHECK ADD FOREIGN KEY([MSSV_BaoLanh])
REFERENCES [dbo].[SinhVien] ([MSSV])
GO
ALTER TABLE [dbo].[Khach]  WITH CHECK ADD FOREIGN KEY([PhongThamId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[NhatKyAnNinh]  WITH CHECK ADD FOREIGN KEY([CameraId])
REFERENCES [dbo].[Camera] ([CameraId])
GO
ALTER TABLE [dbo].[PhanAnh]  WITH CHECK ADD FOREIGN KEY([MSSV])
REFERENCES [dbo].[SinhVien] ([MSSV])
GO
ALTER TABLE [dbo].[PhanAnh]  WITH CHECK ADD FOREIGN KEY([PhongId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[Phong]  WITH CHECK ADD FOREIGN KEY([LoaiPhongId])
REFERENCES [dbo].[LoaiPhong] ([LoaiPhongId])
GO
ALTER TABLE [dbo].[Phong]  WITH CHECK ADD FOREIGN KEY([ToaNhaId])
REFERENCES [dbo].[ToaNha] ([ToaNhaId])
GO
ALTER TABLE [dbo].[SinhVien]  WITH CHECK ADD FOREIGN KEY([PhongDangOId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
ALTER TABLE [dbo].[SinhVien]  WITH CHECK ADD FOREIGN KEY([TaiKhoanId])
REFERENCES [dbo].[TaiKhoan] ([TaiKhoanId])
GO
ALTER TABLE [dbo].[TaiKhoan]  WITH CHECK ADD FOREIGN KEY([VaiTroId])
REFERENCES [dbo].[VaiTro] ([VaiTroId])
GO
ALTER TABLE [dbo].[VatTu]  WITH CHECK ADD FOREIGN KEY([PhongId])
REFERENCES [dbo].[Phong] ([PhongId])
GO
USE [master]
GO
ALTER DATABASE [KTXthongminh] SET  READ_WRITE 
GO
