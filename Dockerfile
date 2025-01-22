# 1단계: 빌드 단계
FROM node:20.18.2-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 복사 후 의존성 설치
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

# 소스 코드 복사 및 React 앱 빌드
COPY . .
RUN npm run build

# 2단계: 런타임 단계
FROM node:20.18.2-alpine

# 작업 디렉토리 설정
WORKDIR /app

# 빌드된 결과물을 런타임 컨테이너로 복사
COPY --from=build /app/build ./build

# `serve` 패키지 설치 및 실행 명령 설정
RUN npm install -g serve

# 컨테이너가 시작되면 React 앱 제공
CMD ["serve", "-s", "build", "-l", "3000"]

# 외부 접근을 위한 포트 노출
EXPOSE 3000