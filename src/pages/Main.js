import Header from '../components/header';


function Main() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">주택청약 메인</h2>
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">최근 공고</h3>
            {/* 여기에 실제 공고 내용 추가 */}
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-xl font-bold mb-2">청약 일정</h3>
            {/* 여기에 실제 일정 내용 추가 */}
          </div>
        </section>
      </main>
      {/*<Footer />*/}
    </div>
  );
}

export default Main;