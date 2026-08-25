export const locales = ["en", "ko"] as const;

export type Locale = (typeof locales)[number];

export function isLocale(value: string | undefined): value is Locale {
  return value === "en" || value === "ko";
}

export const dictionaries = {
  en: {
    common: {
      account: "Account",
      admin: "Admin",
      approve: "Approve after deposit",
      backToClasses: "Back to classes",
      booking: "Booking",
      bookings: "Bookings",
      capacity: "Capacity",
      class: "Class",
      classes: "Classes",
      closed: "Closed",
      confirmed: "confirmed",
      create: "Create",
      email: "Email",
      expireDate: "Expire date",
      expires: "Expires",
      fullName: "Full name",
      language: "Language",
      left: "left",
      live: "Live",
      location: "Location",
      login: "Login",
      note: "Note",
      okGoToLogin: "OK, go to login",
      open: "Open",
      openingSoon: "Opening Soon",
      password: "Password",
      pending: "pending",
      saveChanges: "Save changes",
      signIn: "Sign in",
      signOut: "Sign out",
      signUp: "Sign up",
      status: "Status",
      student: "Student",
      summary: "Summary",
      title: "Title",
      vouchers: "Vouchers",
    },
    home: {
      activeVouchers: "Active Vouchers",
      addSupabase:
        "Add Supabase environment variables to enable login, booking, voucher use, and admin management.",
      bookingReceived:
        "Booking received. Voucher bookings are confirmed immediately; otherwise please follow the bank transfer guide.",
      malaysiaTime: "Malaysia time",
      membersWithoutVoucher:
        "Members without an active voucher can submit a booking request first. The booking remains pending until admin confirms the deposit.",
      myBookings: "My Bookings",
      noOpenClasses: "No open classes right now.",
      notAvailable: "Not Available",
      paymentGuide: "Payment Guide",
      previewMode: "Preview mode",
      requestBooking: "Request Booking",
      seatConfirmed: "Your seat is confirmed.",
      signedInAs: "Signed in as",
      signInToBook: "Sign in to book",
      transferGuide:
        "Please transfer payment and wait for admin approval after deposit confirmation.",
    },
    auth: {
      alreadyHaveAccount: "Already have an account? Sign in",
      atLeastCharacters: "At least 6 characters",
      checkEmail: "Check your email",
      createAccount: "Create account",
      emailVerification: "Email Verification",
      newMember: "New member? Create account",
      sentVerification:
        "We sent a verification link. Please verify your email first, then return to the login page.",
      sentVerificationTo:
        "We sent a verification link to {email}. Please verify your email first, then return to the login page.",
      supabaseRequired:
        "Supabase environment variables are required before authentication can run.",
      useSameLogin:
        "Use the same login for class bookings and admin management.",
      welcomeBack: "Welcome back",
      yourName: "Your name",
    },
    admin: {
      accessDenied: "Access denied",
      accessLimited: "Admin access is limited to {email}.",
      addVoucher: "Add voucher",
      adminLogin: "Admin Login",
      classCreated: "Class created.",
      classUpdated: "Class updated.",
      connectSupabase:
        "Connect Supabase environment variables and apply the migration before using admin management.",
      createClass: "Create Class",
      editClass: "Edit class",
      manageIntro:
        "Sign in with {email} to manage classes, bookings, students, and vouchers.",
      management: "Management",
      noBookings: "No bookings yet.",
      noClasses: "No {status} classes.",
      noVouchers: "No vouchers registered yet.",
      pendingDeposit:
        "{count} booking request needs deposit confirmation.",
      selectStudent: "Select student",
      startsAt: "Starts at",
      studentList: "Student List",
      studentVouchers: "Student Vouchers",
      students: "Students",
      supabaseRequired: "Supabase required",
      voucherAdded: "Voucher added.",
      voucherCount: "Voucher count",
    },
    pwa: {
      addHome: "Add it to your home screen for faster class booking.",
      dismissInstall: "Dismiss install prompt",
      install: "Install",
      installTitle: "Install HappyLife",
    },
  },
  ko: {
    common: {
      account: "계정",
      admin: "관리자",
      approve: "입금 확인 후 승인",
      backToClasses: "클래스 목록으로 돌아가기",
      booking: "예약",
      bookings: "예약",
      capacity: "정원",
      class: "클래스",
      classes: "클래스",
      closed: "마감",
      confirmed: "확정",
      create: "생성",
      email: "이메일",
      expireDate: "만료일",
      expires: "만료",
      fullName: "이름",
      language: "언어",
      left: "남음",
      live: "실시간",
      location: "장소",
      login: "로그인",
      note: "메모",
      okGoToLogin: "확인하고 로그인으로 이동",
      open: "오픈",
      openingSoon: "오픈예정",
      password: "비밀번호",
      pending: "대기",
      saveChanges: "변경 저장",
      signIn: "로그인",
      signOut: "로그아웃",
      signUp: "가입하기",
      status: "상태",
      student: "수강생",
      summary: "개요",
      title: "제목",
      vouchers: "바우처",
    },
    home: {
      activeVouchers: "사용 가능한 바우처",
      addSupabase:
        "로그인, 예약, 바우처, 관리자 기능을 사용하려면 Supabase 환경 변수를 추가하세요.",
      bookingReceived:
        "예약 신청이 접수되었습니다. 바우처 예약은 즉시 확정되며, 바우처가 없으면 입금 안내 후 관리자 승인을 기다려주세요.",
      malaysiaTime: "말레이시아 시간",
      membersWithoutVoucher:
        "활성 바우처가 없는 회원은 먼저 예약 신청을 할 수 있습니다. 입금 확인 후 관리자가 승인하면 예약이 확정됩니다.",
      myBookings: "내 예약",
      noOpenClasses: "현재 오픈된 클래스가 없습니다.",
      notAvailable: "예약 불가",
      paymentGuide: "입금 안내",
      previewMode: "미리보기 모드",
      requestBooking: "예약 신청",
      seatConfirmed: "좌석이 확정되었습니다.",
      signedInAs: "로그인 계정",
      signInToBook: "로그인 후 예약",
      transferGuide:
        "입금 후 관리자 승인까지 기다려주세요. 입금 확인 후 예약이 확정됩니다.",
    },
    auth: {
      alreadyHaveAccount: "이미 계정이 있나요? 로그인",
      atLeastCharacters: "6자 이상 입력",
      checkEmail: "이메일을 확인해주세요",
      createAccount: "계정 만들기",
      emailVerification: "이메일 인증",
      newMember: "처음이신가요? 회원가입",
      sentVerification:
        "인증 링크를 보냈습니다. 이메일 인증을 먼저 완료한 뒤 로그인 페이지로 돌아와 주세요.",
      sentVerificationTo:
        "{email} 주소로 인증 링크를 보냈습니다. 이메일 인증을 먼저 완료한 뒤 로그인 페이지로 돌아와 주세요.",
      supabaseRequired:
        "인증 기능을 사용하려면 Supabase 환경 변수가 필요합니다.",
      useSameLogin:
        "클래스 예약과 관리자 메뉴에서 같은 계정을 사용합니다.",
      welcomeBack: "다시 오신 것을 환영합니다",
      yourName: "이름을 입력하세요",
    },
    admin: {
      accessDenied: "접근 권한 없음",
      accessLimited: "관리자 접근은 {email} 계정만 가능합니다.",
      addVoucher: "바우처 등록",
      adminLogin: "관리자 로그인",
      classCreated: "클래스가 생성되었습니다.",
      classUpdated: "클래스가 수정되었습니다.",
      connectSupabase:
        "관리자 기능을 사용하려면 Supabase 환경 변수와 마이그레이션 적용이 필요합니다.",
      createClass: "클래스 생성",
      editClass: "클래스 수정",
      manageIntro:
        "클래스, 예약, 수강생, 바우처를 관리하려면 {email} 계정으로 로그인하세요.",
      management: "관리",
      noBookings: "예약자가 아직 없습니다.",
      noClasses: "{status} 클래스가 없습니다.",
      noVouchers: "등록된 바우처가 없습니다.",
      pendingDeposit: "입금 확인이 필요한 예약 신청 {count}건이 있습니다.",
      selectStudent: "수강생 선택",
      startsAt: "시작 시간",
      studentList: "예약자 명단",
      studentVouchers: "수강생 바우처",
      students: "수강생",
      supabaseRequired: "Supabase 설정 필요",
      voucherAdded: "바우처가 등록되었습니다.",
      voucherCount: "바우처 수량",
    },
    pwa: {
      addHome: "홈 화면에 추가하면 더 빠르게 예약할 수 있습니다.",
      dismissInstall: "설치 안내 닫기",
      install: "설치",
      installTitle: "HappyLife 설치",
    },
  },
} as const;

type WidenStrings<T> = T extends string
  ? string
  : {
      [K in keyof T]: WidenStrings<T[K]>;
    };

export type Dictionary = WidenStrings<(typeof dictionaries)["en"]>;

export function getDictionary(locale: Locale = "en"): Dictionary {
  return dictionaries[locale];
}

export function interpolate(template: string, values: Record<string, string | number>) {
  return Object.entries(values).reduce(
    (message, [key, value]) => message.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
