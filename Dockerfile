FROM node:18-alpine

# ������������� ����������� ��� ������ �������� ������� (����� ������ ���� ���� ������ ����� node-sass, sharp, bcrypt)
# ���� � ��� ������ React/Vue/Next.js ��� ����� ������������, ��� ������ ����� ������� ��� ��������� ������.
RUN apk add --no-cache python3 make g++ gcc libc-dev

WORKDIR /app

# �������� ������ ����� ���������� (package.json � package-lock.json)
# ��� ��������� Docker ������������ ���� � ������������� � �� ����������������� �� ��� ������ ��������� ����
COPY package.json package-lock.json ./

# ������ ��������� (Clean Install). ������ ������� package-lock.json
RUN npm ci --legacy-peer-deps

# �������� ���� �������� ��� ����������
COPY . .

# !!! �����: ���� �� ����������� Next.js, Nuxt ��� ������ ���������, ��������� ������:
# ���������������� ��������� ������, ����� ������� ���������������� ���������-���� ����� ��������
# RUN npm run build

EXPOSE 3000

# ������ ���������� (��� Next.js ��� ������ "start", ��� Vite/CRA � dev-������ ���� ����� ���� "start")
CMD ["npm", "start"]