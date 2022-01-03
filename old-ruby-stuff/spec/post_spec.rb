require 'spec_helper'
require './lib/post'

RSpec.describe Post do
  let(:file_path) { './something.md' }
  let(:frontmatter) do
    {
      'title' => 'A title',
      'categories' => 'a b c',
      'date' => Date.new(2017, 01, 01)
    }
  end

  before(:each) do
    allow(FrontMatterParser::Parser).to receive(:parse_file)
                                    .and_return(frontmatter)
  end

  describe '#title' do
    it 'gets the title from the frontmatter' do
      instance = described_class.new(file_path)
      expect(instance.title).to eq frontmatter['title']
    end
  end

  describe 'date' do
    context 'with date in frontmatter' do
      it 'returns the date in the frontmatter' do
        instance = described_class.new(file_path)
        expect(instance.date).to eq frontmatter['date']
      end
    end

    context 'with time in frontmatter' do
      it 'returns the time converted to a date' do
        frontmatter_with_time = frontmatter.merge({
          'date' => Time.new(2017, 01, 02)
        })
        allow(FrontMatterParser::Parser).to receive(:parse_file)
                                    .and_return(frontmatter_with_time)
        instance = described_class.new(file_path)
        expect(instance.date).to eq Date.new(2017, 01, 02)
      end
    end

    context 'no date in frontmatter' do
      it 'returns the date from git log' do
        fm_without_date = frontmatter.clone
        fm_without_date.delete('date')
        allow(FrontMatterParser::Parser).to receive(:parse_file)
                                    .and_return(fm_without_date)

        from_git = Date.new(2017, 02, 03)
        mock = double('DateFromGitLog', to_date: from_git)
        allow(DateFromGitLog).to receive(:new).and_return(mock)
        instance = described_class.new(file_path)
        expect(instance.date).to eq from_git
      end
    end
  end
end
