class ChangeColumnDefaultCategory < ActiveRecord::Migration
  def change
  	change_column_default :posts, :category_id, 1
  end

end
